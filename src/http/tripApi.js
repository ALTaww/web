import { $host, $authHost } from ".";

export const create = async ({
  driver_id,
  from_location,
  to_location,
  when_time,
  price,
  seats,
}) => {
  const { data } = await $authHost.post("/trip", {
    driver_id,
    from_location,
    to_location,
    when_time,
    price,
    seats,
  });
  return data;
};

export const deleteTrip = async (id) => {
  const { data } = await $authHost.delete(`/trip/${id}`);
  return data;
};

export const getTrip = async (id) => {
  const { data } = await $host.get(`/trip/${id}`);
  return data;
};

export const getTrips = async (limit = 3) => {
  const { data } = await $host.get(`/trip?limit=${limit}`);
  return data;
};

export const getLastTrips = async (limit = 3) => {
  const { data } = await $host.get(`/trips?reverse=true&limit=${limit}`);
  return data;
};

export const getTripsByUserId = async (userId) => {
  const { data } = await $host.get(`/trips?userId=${userId}`);
  return data;
};

export const getTripsByDriverId = async (id) => {
  const { data } = await $host.get(`/trips?driverId=${id}`);
  return data;
};

export const getSuitableTrips = async (from, to, when) => {
  const { data } = await $host.get(`/trips?from=${from}&to=${to}&when=${when}`);
  return data;
};

export const bookTrip = async (trip_id, passengersIds) => {
  const { data } = await $authHost.post(`/trip/book/${trip_id}`, {
    passengersIds,
  });
  return data;
};
