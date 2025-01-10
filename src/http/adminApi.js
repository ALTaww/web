import { $adminHost } from ".";

class AdminApi {
  getAllUserInfo = async (userId, signal) => {
    const { data } = await $adminHost.get(`/user/${userId}`, {
      signal,
    });
    return data;
  };

  getTripById = async (tripId, signal) => {
    const { data } = await $adminHost.get(`/trip/${tripId}`, {
      signal,
    });
    return data;
  };

  getReviewById = async (reviewId, signal) => {
    const { data } = await $adminHost.get(`/review/${reviewId}`, {
      signal,
    });
    return data;
  };
}

const adminApi = new AdminApi();
export default adminApi;
