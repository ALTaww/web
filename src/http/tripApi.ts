import { $host, $authHost } from ".";
import { ITrips } from "../types/database";

interface ICreate extends ITrips {
  // driver_id: number;
  // from_location: string;
  // to_location: string;
  // when_time: string;
  // price: number;
  // seats: number;
  signal: AbortSignal;
}

class TripApi {
  create = async ({
    driver_id,
    from_location,
    to_location,
    when_time,
    price,
    seats,
    signal,
  }: ICreate): Promise<ITrips> => {
    const { data } = await $authHost.post(
      "/trip",
      {
        driver_id,
        from_location,
        to_location,
        when_time,
        price,
        seats,
      },
      {
        signal,
      }
    );
    return data;
  };

  deleteTrip = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ITrips> => {
    const { data } = await $authHost.delete(`/trip/${id}`, {
      signal,
    });
    return data;
  };

  getTrip = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ITrips> => {
    const { data } = await $host.get(`/trip/${id}`, {
      signal,
    });
    return data;
  };

  getTrips = async (
    limit = 3,
    reverse = false,
    page: number | string,
    signal: AbortSignal
  ): Promise<ITrips[]> => {
    const { data } = await $host.get(
      `/get-trips?limit=${limit}&page=${page}&reverse=${reverse}`,
      {
        signal,
      }
    );
    return data;
  };

  getLastTrips = async (limit = 3, signal: AbortSignal): Promise<ITrips[]> => {
    const { data } = await $host.get(`/trips?reverse=true&limit=${limit}`, {
      signal,
    });
    return data;
  };

  getTripsByUserId = async (
    userId: number | string,
    signal: AbortSignal
  ): Promise<ITrips[]> => {
    const { data } = await $host.get(`/trips?userId=${userId}`, {
      signal,
    });
    return data;
  };

  getTripsByDriverId = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ITrips[]> => {
    const { data } = await $host.get(`/trips?driverId=${id}`, {
      signal,
    });
    return data;
  };

  getSuitableTrips = async (
    from: string,
    to: string,
    when: string,
    signal: AbortSignal
  ): Promise<ITrips[]> => {
    const { data } = await $host.get(
      `/trips?from=${from}&to=${to}&when=${when}`,
      {
        signal,
      }
    );
    return data;
  };

  bookTrip = async (
    trip_id: number | string,
    passengersIds: number[],
    signal: AbortSignal
    // не факт что это так
  ): Promise<{ trips: ITrips }> => {
    const { data } = await $authHost.post(
      `/trip/book/${trip_id}`,
      {
        passengersIds,
      },
      {
        signal,
      }
    );
    return data;
  };

  unbookTrip = async (
    trip_id: number | string,
    signal: AbortSignal
    // не полное типизирование
  ): Promise<{ id: number; trip_id: number; booker_id: number }> => {
    const { data } = await $authHost.post(
      `/trip/unbook/${trip_id}`,
      {},
      {
        signal,
      }
    );
    return data;
  };
}

const tripApi = new TripApi();
export default tripApi;
