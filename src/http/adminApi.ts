import { $adminHost } from ".";

class AdminApi {
  getAllUserInfo = async (
    userId: number | string,
    signal: AbortSignal
    // не полное типизирование
  ): Promise<{
    userInfo: {};
    trips: [];
    bookedTrips: [];
    friends: [];
    reviews: [];
  }> => {
    const { data } = await $adminHost.get(`/user/${userId}`, {
      signal,
    });
    return data;
  };

  getTripById = async (
    tripId: number | string,
    signal: AbortSignal
    // не полное типизирование
  ): Promise<{ id: number }> => {
    const { data } = await $adminHost.get(`/trip/${tripId}`, {
      signal,
    });
    return data;
  };

  getReviewById = async (reviewId: number | string, signal: AbortSignal) => {
    const { data } = await $adminHost.get(`/review/${reviewId}`, {
      signal,
    });
    return data;
  };
}

const adminApi = new AdminApi();
export default adminApi;
