import React, { useContext, useEffect, useState } from "react";
import TripSearch from "../components/TripSearch";
import Trip from "../components/Trip";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { getSuitableTrips } from "../http/tripApi";
import { isDate } from "../utils/helpers";
import { Context } from "..";

const Searchresults = () => {
  const { tripStore } = useContext(Context);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const when = queryParams.get("when");

  const isSearching = from && to && isDate(when);

  tripStore.setFrom(from);
  tripStore.setTo(to);
  tripStore.setWhen(when);

  const [suitableTrips, setSuitableTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSearching) {
      (async () => {
        try {
          const response = await getSuitableTrips(from, to, when);
          setSuitableTrips(response);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    setIsLoading(false);
  }, [from, to, when, isSearching]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TripSearch />
      {suitableTrips.length > 0 &&
        suitableTrips.map((trip) => <Trip key={trip.id} {...trip} />)}
      {suitableTrips.length === 0 && !isSearching && (
        <h2 className="center-text">Начните искать поездку</h2>
      )}
      {suitableTrips.length === 0 && isSearching && (
        <h2 className="center-text">Подходящих поездок нет</h2>
      )}
    </>
  );
};

export default Searchresults;
