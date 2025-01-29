import { $host, $authHost } from ".";

interface ICreate {
  user_id: number;
  driver_id: number;
  text: string;
  rate: number;
}

class ReviewApi {
  create = async (
    { user_id, driver_id, text, rate }: ICreate,
    signal: AbortSignal
  ): Promise<ICreate> => {
    const { data } = await $host.post(
      "/review",
      { user_id, driver_id, text, rate },
      {
        signal,
      }
    );
    return data;
  };

  deleteRewiew = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ICreate> => {
    const { data } = await $host.delete(`/review/${id}`, {
      signal,
    });
    return data;
  };

  getRewiewById = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ICreate> => {
    const { data } = await $host.get(`/review/${id}`, {
      signal,
    });
    return data;
  };

  getRewiews = async (signal: AbortSignal): Promise<ICreate[]> => {
    const { data } = await $authHost.get("/reviews", {
      signal,
    });
    return data;
  };

  getRewiewByUserId = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ICreate> => {
    const { data } = await $authHost.get(`/review/user?user_id=${id}`, {
      signal,
    });
    return data;
  };

  getRewiewByDriverId = async (
    id: number | string,
    signal: AbortSignal
  ): Promise<ICreate> => {
    const { data } = await $host.get(`/review/user?driver_id=${id}`, {
      signal,
    });
    return data;
  };
}

const reviewApi = new ReviewApi();
export default reviewApi;
