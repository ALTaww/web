import React, { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { userRoles } from "../utils/consts";
import Trip from "../components/Trip";
import adminApi from "../http/adminApi";
import tripApi from "../http/tripApi";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { normilizeDateWithHourAndMins } from "../utils/helpers";
import userStore from "../store/userStore";
import { fetchWithAbort } from "../utils/fetchWithAbort";

const UserTrips = () => {
  const navigate = useNavigate();
  const [bookedTrips, setBookedTrips] = useState([]);
  const [tripsAsPassenger, setTripsAsPassenger] = useState([]);
  const [tripsAsDriver, setTripsAsDriver] = useState([]);

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

  return (
    <div className="user-trips">
      <h3>Мои поездки как пассажир</h3>
      <button onClick={() => navigate(paths.Searchresults)}>
        Найти новую поездку
      </button>
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
            </div>
          ))}
      </div>
      {(userStore.data.role === userRoles.driver ||
        userStore.data.role === userRoles.admin) && (
        <>
          <h3>Мои поездки как водитель</h3>
          <button onClick={() => navigate(paths.MakeTrips)}>
            Создать новую поездку
          </button>
          <div className="trips-as-driver">
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
