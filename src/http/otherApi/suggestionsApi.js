import { $host } from "..";

export const getSettlements = async (query) => {
  const { data } = await $host.get("/settlements/" + query);
  return data;
};
