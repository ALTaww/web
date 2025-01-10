import { $host, $authHost } from ".";
class TripApi {
  create = async ({
    driver_id,
    from_location,
    to_location,
    when_time,
    price,
    seats,
    signal,
  }) => {
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

  deleteTrip = async (id, signal) => {
    const { data } = await $authHost.delete(`/trip/${id}`, {
      signal,
    });
    return data;
  };

  getTrip = async (id, signal) => {
    const { data } = await $host.get(`/trip/${id}`, {
      signal,
    });
    return data;
  };

  getTrips = async (limit = 3, signal) => {
    const { data } = await $host.get(`/trip?limit=${limit}`, {
      signal,
    });
    return data;
  };

  getLastTrips = async (limit = 3, signal) => {
    const { data } = await $host.get(`/trips?reverse=true&limit=${limit}`, {
      signal,
    });
    return data;
  };

  getTripsByUserId = async (userId, signal) => {
    const { data } = await $host.get(`/trips?userId=${userId}`, {
      signal,
    });
    return data;
  };

  getTripsByDriverId = async (id, signal) => {
    const { data } = await $host.get(`/trips?driverId=${id}`, {
      signal,
    });
    return data;
  };

  getSuitableTrips = async (from, to, when, signal) => {
    const { data } = await $host.get(
      `/trips?from=${from}&to=${to}&when=${when}`,
      {
        signal,
      }
    );
    return data;
  };

  bookTrip = async (trip_id, passengersIds, signal) => {
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
}

const tripApi = new TripApi();
export default tripApi;
