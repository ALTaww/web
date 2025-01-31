import { $adminHost } from ".";
import { IReviews, ITrips, IUsers } from "../types/database";

class AdminApi {
  getAllUserInfo = async (
    userId: number | string,
    signal: AbortSignal
    // не полное типизирование
  ): Promise<{
    userInfo: IUsers;
    trips: ITrips[];
    bookedTrips: [];
    friends: IUsers[];
    reviews: IReviews[];
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
  ): Promise<ITrips> => {
    const { data } = await $adminHost.get(`/trip/${tripId}`, {
      signal,
    });
    return data;
  };

  getReviewById = async (
    reviewId: number | string,
    signal: AbortSignal
  ): Promise<IReviews> => {
    const { data } = await $adminHost.get(`/review/${reviewId}`, {
      signal,
    });
    return data;
  };
}

const adminApi = new AdminApi();
export default adminApi;
