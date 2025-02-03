import React, { useEffect, useState } from "react";
import TripSearch from "../components/TripSearch";
import Trip from "../components/Trip";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { isDate } from "../utils/helpers";
import tripStore from "../store/tripStore";
import tripApi from "../http/tripApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { ITrips } from "../types/database";

const Searchresults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from") || "";
  const to = queryParams.get("to") || "";
  const when = queryParams.get("when") || "";

  const isSearching = from && to && isDate(when);

  useEffect(() => {
    tripStore.setFrom(from);
    tripStore.setTo(to);
    tripStore.setWhen(when);
  }, [from, to, when]);

  const [suitableTrips, setSuitableTrips] = useState<ITrips[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controler = new AbortController();
    const signal = controler.signal;

    if (isSearching) {
      (async () => {
        try {
          const response = await fetchWithAbort(
            (signal) => tripApi.getSuitableTrips(from, to, when, signal),
            signal
          );
          setSuitableTrips(response);
        } catch (err) {
          console.log(err);
        }
      })();
    }
    setIsLoading(false);
    return () => controler.abort();
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
