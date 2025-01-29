import { $driverHost } from "..";

class DirectionsApi {
  getRoute = async (
    points: number[],
    signal: AbortSignal
  ): Promise<{ polyline: string; time: Date; distance: string }> => {
    const { data } = await $driverHost.post(
      "/directions",
      { points },
      {
        signal,
      }
    );
    return data;
  };

  getSettlementsByRoute = async (
    polyline: string,
    signal: AbortSignal
  ): Promise<{ name: string; lon: number; lat: number; type: string }[]> => {
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
