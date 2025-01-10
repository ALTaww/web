import { $driverHost } from "..";

class DirectionsApi {
  getRoute = async (points, signal) => {
    const { data } = await $driverHost.post(
      "/directions",
      { points },
      {
        signal,
      }
    );
    return data;
  };

  getSettlementsByRoute = async (polyline, signal) => {
    const { data } = await $driverHost.post(
      "/directions/settlements",
      {
        polyline,
      },
      {
        signal,
      }
    );
    return data;
  };
}

const directionsApi = new DirectionsApi();
export default directionsApi;
