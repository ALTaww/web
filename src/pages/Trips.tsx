import React, { useEffect, useState } from "react";
import ComponentContainer from "../components/ComponentContainer";
import Trip from "../components/Trip";
import { showNotification } from "../utils/helpers";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import tripApi from "../http/tripApi";
import { useLocation } from "react-router-dom";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import Loading from "../components/Loading";
import { ITrips } from "../types/database";

const Trips = () => {
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("page");
  const to = queryParams.get("reverse");
  const when = queryParams.get("when");

  useEffect(() => {}, []);

  async function getSelectedTrips(signal: AbortSignal) {
    const trips = await tripApi.getTrips(10, true, page, signal);
    setTrips(trips);
    console.log("trips: ", trips);
  }

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    (async () => {
      try {
        await fetchWithAbort((signal) => getSelectedTrips(signal), signal);
      } catch (err) {
        console.error(err);
        showNotification(
          <p>Произошла ошибка при получении поездок</p>,
          notificationTimeouts.short,
          notificationStatuses.error
        );
      } finally {
        setLoading(false);
      }
    })();
    return () => abortController.abort();
  }, []);
  return (
    <div className="page trips-page">
      <ComponentContainer>
        <h1>Поездки</h1>
        <p>Тут будет сортировка</p>
        {loading ? <Loading /> : trips.map((trip) => <Trip {...trip} />)}
      </ComponentContainer>
    </div>
  );
};

export default Trips;
