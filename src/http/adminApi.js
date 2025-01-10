import { $adminHost } from ".";

export const getAllUserInfo = async (userId) => {
  const { data } = await $adminHost.get(`/user/${userId}`);
  return data;
};

export const getTripById = async (tripId) => {
  const { data } = await $adminHost.get(`/trip/${tripId}`);
  return data;
};

export const getReviewById = async (reviewId) => {
  const { data } = await $adminHost.get(`/review/${reviewId}`);
  return data;
};
