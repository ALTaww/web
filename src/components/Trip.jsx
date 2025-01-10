import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { paths } from "../pages/paths";
import axios from "axios";
import Loading from "./Loading";
import { getUser } from "../http/userApi";
import { getTrip } from "../http/tripApi";
import vk_image from "../assets/img/vk.png";
import {
  getGrammaticalEnding,
  normalizeCountForm,
  normilizeDate,
  normilizeDateWithHourAndMins,
  toggleActive,
} from "../utils/helpers";
import { grammaticalEndings } from "../utils/consts";

const Trip = (props) => {
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
    if (!id) {
      console.error("Вы должны передать id в компонент Trip");
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        if (!tripInfo.driver_id) {
          const trip = await getTrip(id);
          setTripInfo(trip);
        }
        if (!driverInfo.name) {
          const response = await getUser(tripInfo.driver_id);
          setDriverInfo(response);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, tripInfo.driver_id, driverInfo.name]);

  if (isLoading) {
    return <Loading />;
  }

  let freeSeats = tripInfo.seats - tripInfo.occupied_seats;

  return (
    <>
      <div className="container">
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
      </div>
    </>
  );
};

export default Trip;
