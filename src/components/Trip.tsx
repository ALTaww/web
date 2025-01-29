import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { paths } from "../pages/paths";
import axios from "axios";
import Loading from "./Loading";
import vk_image from "../assets/img/vk.png";
import {
  getGrammaticalEnding,
  normilizeDateWithHourAndMins,
} from "../utils/helpers";
import { grammaticalEndings } from "../utils/consts";
import userApi from "../http/userApi";
import tripApi from "../http/tripApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import ComponentContainer from "./ComponentContainer";
import "../css/trip.css";
import { ITrips, IUser } from "../types/database";

interface IComponent extends IUser, ITrips {
  isBooking?: boolean;
  children?: React.ReactNode;
}

const Trip: FC<IComponent> = (props) => {
  const {
    id,
    driver_id,
    seats,
    occupied_seats,
    price,
    from_location,
    to_location,
    when_time,
    name,
    surname,
    phone,
    vk_id,
    rating,
    rating_count,
    isBooking,
  } = props;
  const [tripInfo, setTripInfo] = useState({
    id,
    driver_id,
    seats,
    occupied_seats,
    price,
    from_location,
    to_location,
    when_time,
  });
  const [driverInfo, setDriverInfo] = useState({
    name,
    surname,
    phone,
    vk_id,
    rating,
    rating_count,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!id) {
      console.error("Вы должны передать id в компонент Trip");
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        if (!tripInfo.driver_id) {
          const trip = await fetchWithAbort(
            (signal) => tripApi.getTrip(id, signal),
            signal
          );
          setTripInfo(trip);
        }
        if (!driverInfo.name) {
          const response = await fetchWithAbort(
            (signal) => userApi.getUser(tripInfo.driver_id, signal),
            signal
          );
          setDriverInfo(response);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, tripInfo.driver_id, driverInfo.name]);

  if (isLoading) {
    return <Loading />;
  }

  let freeSeats = tripInfo.seats - tripInfo.occupied_seats;

  return (
    <>
      <ComponentContainer>
        <div className="searchresults-container">
          <div className="info-container">
            <span className="driver-name">
              {driverInfo.name + " " + driverInfo.surname}
            </span>
            <div>
              Свободно <span className="free-places">{freeSeats}</span>{" "}
              {getGrammaticalEnding(freeSeats, grammaticalEndings.seats)} из{" "}
              <span>{tripInfo.seats}</span>
            </div>
          </div>
          <div className="info-container">
            <span className="trip-places">
              {tripInfo.from_location} - {tripInfo.to_location}
            </span>
            <span className="when">
              {normilizeDateWithHourAndMins(tripInfo.when_time)}
            </span>
          </div>
          <div className="info-container">
            <span className="price">{tripInfo.price} руб.</span>
          </div>
          <div className="info-container driver-info">
            {driverInfo.phone && (
              <span className="mobile">{driverInfo.phone}</span>
            )}
            <a
              className="link vk-link"
              href={`https://vk.com/id${driverInfo.vk_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Вконтакте водителя
            </a>
          </div>
          <div>
            {!isBooking && <Link to={paths.Booking + "/" + id}>Подробнее</Link>}
          </div>
          {props.children}
        </div>
      </ComponentContainer>
    </>
  );
};

export default Trip;
