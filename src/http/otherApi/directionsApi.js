import { $driverHost } from "..";

export const getRoute = async (points) => {
  const { data } = await $driverHost.post("/directions", { points });
  return data;
};

export const getSettlementsByRoute = async (polyline) => {
  const { data } = await $driverHost.post("/directions/settlements", {
    polyline,
  });
  return data;
};
