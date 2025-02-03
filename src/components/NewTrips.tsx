import React, { useEffect, useState } from "react";
import Trip from "./Trip";
import Loading from "./Loading";
import tripApi from "../http/tripApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { ITrips } from "../types/database";
import ComponentContainer from "./ComponentContainer";

const NewTrips = () => {
  const [lastTrips, setLastTrips] = useState<ITrips[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const response = await fetchWithAbort(
          (signal) => tripApi.getTrips(3, true, 1, signal),
          signal
        );
        response && setLastTrips(response);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    })();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ComponentContainer>
      <div className="new-trips">
        <h2>Новые поездки</h2>
        {lastTrips.map((trip) => (
          <Trip key={trip.id} {...trip} />
        ))}
      </div>
    </ComponentContainer>
  );
};

export default NewTrips;
