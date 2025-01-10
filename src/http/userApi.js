import { $host, $authHost } from ".";
import { deleteCookie, setCookie } from "./cookie";

export const deleteUser = async (id) => {
  const { data } = await $authHost.delete(`/user/${id}`);
  deleteCookie("accessToken");
  return data;
};

export const getUser = async (id) => {
  const { data } = await $host.get(`/user/${id}`);
  return data;
};

export const getUsers = async () => {
  const { data } = await $authHost.get("/users");
  return data;
};

export const generateVkConfig = async () => {
  const { data } = await $host.get("/vk/config");
  return data;
};

export const createOrLoginUser = async (
  code,
  state,
  device_id,
  code_verifier
) => {
  const { data } = await $host.post(
    `/vk/create-or-login-user`,
    {
      code,
      state,
      device_id,
      code_verifier,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getHttpOnlyCookie = async (name) => {
  const { data } = await $host.get("/cookie/get/" + name, {
    withCredentials: true,
  });
  return data.value;
};

export const setHttpOnlyCookie = async (name, value, expiresMin) => {
  const { data } = await $host.post(
    "/cookie/set",
    {
      name,
      value,
      expiresMin,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getUserRole = async () => {
  const { data } = await $authHost.get("/get-user-role");
  return data;
};

export const getUserId = async () => {
  const { data } = await $authHost.get("/get-user-id");
  return data.id;
};

export const refreshTokens = async () => {
  const { data } = await $authHost.post("/refresh");
  return data;
};

export const addFriend = async (friendId) => {
  const { data } = await $authHost.post("/add-friend", { friendId });
  return data;
};

export const deleteFriend = async (friendId) => {
  const { data } = await $authHost.delete("/delete-friend/" + friendId);
  return data;
};

export const getFriendship = async (friendId) => {
  const { data } = await $authHost.get("/friendship/" + friendId);
  return data;
};

export const getAcceptedFriends = async () => {
  const { data } = await $authHost.get("/get-accepted-friends");
  return data;
};

export const getSendedRequests = async () => {
  const { data } = await $authHost.get("/get-sended-requests");
  return data;
};

export const getSubscribers = async () => {
  const { data } = await $authHost.get("/get-subscribers");
  return data;
};

export const getAcceptedFriendsByNameAndSurname = async (search) => {
  const { data } = await $authHost.get(
    "/get-accepted-friends-by-name-and-surname/" + search
  );
  return data;
};

export const getRejectedRequests = async () => {
  const { data } = await $authHost.get("/get-rejected-requests");
  return data;
};

export const logoutFromAccount = async () => {
  const { data } = await $authHost.post("/logout");
  return data;
};

export const test = async () => {
  const { data } = await $host.post(
    "/test",
    {},
    {
      //withCredentials: true,
    }
  );
  return data;
};
