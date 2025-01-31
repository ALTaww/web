import React, { useEffect, useRef, useState } from "react";
import { timeTypes, userRoles } from "../utils/consts";
import Trip from "../components/Trip";
import adminApi from "../http/adminApi";
import tripApi from "../http/tripApi";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { normilizeDateWithHourAndMins } from "../utils/helpers";
import userStore from "../store/userStore";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import "../css/user-trips.css";
import Button from "../templates/Buttons/Button";
import { createNewAbortController } from "../utils/createNewAbortController";
import { ITrips } from "../types/database";

const UserTrips = () => {
  const navigate = useNavigate();
  const [bookedTrips, setBookedTrips] = useState<ITrips[]>([]);

  const [tripsAsPassenger, setTripsAsPassenger] = useState<ITrips[]>([]);
  const [tripsAsDriver, setTripsAsDriver] = useState<ITrips[]>([]);

  const [futureTripsAsPassenger, setFutureTripsAsPassenger] = useState([]);
  const [pastTripsAsPassenger, setPastTripsAsPassenger] = useState([]);
  const [futureTripsAsDriver, setFutureTripsAsDriver] = useState([]);
  const [pastTripsAsDriver, setPastTripsAsDriver] = useState([]);
  const [selectedTimeAsPassenger, setSelectedTimeAsPassenger] = useState(
    timeTypes.future
  );
  const [selectedTimeAsDriver, setSelectedTimeAsDriver] = useState(
    timeTypes.future
  );

  const abortControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    const controler = new AbortController();
    const signal = controler.signal;

    (async () => {
      const passengerTrips = await fetchWithAbort(
        (signal) => tripApi.getTripsByUserId(userStore.data.id, signal),
        signal
      );
      console.log(passengerTrips);
      setBookedTrips(passengerTrips);
      const bookedTripsInfo = await Promise.all(
        passengerTrips.map((trip) =>
          fetchWithAbort(
            (signal) => adminApi.getTripById(trip.trip_id, signal),
            signal
          )
        )
      );
      console.log(bookedTripsInfo);
      setTripsAsPassenger(bookedTripsInfo);

      if (
        userStore.data.role === userRoles.driver ||
        userStore.data.role === userRoles.admin
      ) {
        const driverTrips = await fetchWithAbort(
          (signal) => tripApi.getTripsByDriverId(userStore.data.id, signal),
          signal
        );
        console.log(driverTrips);
        setTripsAsDriver(driverTrips);
      }
    })();

    return () => controler.abort();
  }, [userStore.data.id, userStore.data.role]);

  async function unbookTrip(tripId: number) {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const response = await fetchWithAbort(
        (signal) => tripApi.unbookTrip(tripId, signal),
        signal
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    } finally {
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="user-trips-page page">
      <h3>Мои поездки как пассажир</h3>
      <div className="time-pagination">
        <div className="future">
          <button
            className={`time-pagination-button${
              selectedTimeAsPassenger === timeTypes.future ? " active" : ""
            }`}
            onClick={() => setSelectedTimeAsPassenger(timeTypes.future)}
          >
            Предстоящие
          </button>
        </div>
        <div className="past">
          <button
            className={`time-pagination-button${
              selectedTimeAsPassenger === timeTypes.past ? " active" : ""
            }`}
            onClick={() => setSelectedTimeAsPassenger(timeTypes.past)}
          >
            Прошедшие
          </button>
        </div>
      </div>
      <Button onClick={() => navigate(paths.Searchresults)}>
        Найти новую поездку
      </Button>
      <div className="trips-as-passenger">
        {tripsAsPassenger.length === 0 && (
          <p>У вас нет активных поездок как пассажир</p>
        )}
        {tripsAsPassenger.length !== 0 &&
          tripsAsPassenger.map((trip, i) => (
            <div>
              <p>{normilizeDateWithHourAndMins(bookedTrips[i].time_booked)}</p>
              {bookedTrips[i].booker_id !== bookedTrips[i].user_id && (
                <p>
                  <Link to={paths.Profile + "/" + bookedTrips[i].booker_id}>
                    Место куплено вашим другом №{bookedTrips[i].booker_id}
                  </Link>
                </p>
              )}

              <Trip key={i} {...trip} />
              <div className="cancel-booking">
                <Button onClick={() => unbookTrip(trip.id)}>
                  Отменить бронь
                </Button>
              </div>
            </div>
          ))}
      </div>
      {(userStore.data.role === userRoles.driver ||
        userStore.data.role === userRoles.admin) && (
        <>
          <h3>Мои поездки как водитель</h3>
          <Button onClick={() => navigate(paths.MakeTrips)}>
            Создать новую поездку
          </Button>
          <div className="trips-as-driver">
            <div className="time-pagination">
              <div className="future">
                <button
                  className={`time-pagination-button${
                    selectedTimeAsPassenger === timeTypes.future
                      ? " active"
                      : ""
                  }`}
                  onClick={() => setSelectedTimeAsPassenger(timeTypes.future)}
                >
                  Предстоящие
                </button>
              </div>
              <div className="past">
                <button
                  className={`time-pagination-button${
                    selectedTimeAsPassenger === timeTypes.past ? " active" : ""
                  }`}
                  onClick={() => setSelectedTimeAsPassenger(timeTypes.past)}
                >
                  Прошедшие
                </button>
              </div>
            </div>
            {tripsAsDriver.length === 0 && (
              <p>У вас нет активных поездок как водитель</p>
            )}
            {tripsAsDriver.length !== 0 &&
              tripsAsDriver.map((trip, i) => <Trip key={i} {...trip} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default UserTrips;
