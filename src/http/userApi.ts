import { $host, $authHost } from ".";

class UserApi {
  deleteUser = async (id: number | string, signal: AbortSignal) => {
    const { data } = await $authHost.delete(`/user/${id}`, {
      signal,
    });
    return data;
  };

  getUser = async (id: number | string, signal: AbortSignal) => {
    const { data } = await $host.get(`/user/${id}`, {
      signal,
    });
    return data;
  };

  getUsers = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/users", {
      signal,
    });
    return data;
  };

  generateVkConfig = async (signal: AbortSignal) => {
    const { data } = await $host.get("/vk/config", {
      signal,
    });
    return data;
  };

  createOrLoginUser = async (
    code: string,
    state: string,
    device_id: string,
    code_verifier: string,
    signal: AbortSignal
  ) => {
    const { data } = await $host.post(
      `/vk/create-or-login-user`,
      {
        code,
        state,
        device_id,
        code_verifier,
        signal,
      },
      {
        withCredentials: true,
        signal,
      }
    );
    return data;
  };

  getHttpOnlyCookie = async (name: string, signal: AbortSignal) => {
    const { data } = await $host.get("/cookie/get/" + name, {
      withCredentials: true,
      signal,
    });
    return data.value;
  };

  setHttpOnlyCookie = async (
    name: string,
    value: string,
    expiresMin: string,
    signal: AbortSignal
  ) => {
    const { data } = await $host.post(
      "/cookie/set",
      {
        name,
        value,
        expiresMin,
      },
      {
        withCredentials: true,
        signal,
      }
    );
    return data;
  };

  getUserRole = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-user-role", {
      signal,
    });
    return data;
  };

  getUserId = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-user-id", {
      signal,
    });
    return data.id;
  };

  refreshTokens = async (signal: AbortSignal) => {
    const { data } = await $authHost.post("/refresh", {
      signal,
    });
    return data;
  };

  addFriend = async (friendId: number | string, signal: AbortSignal) => {
    const { data } = await $authHost.post(
      "/add-friend",
      { friendId },
      {
        signal,
      }
    );
    return data;
  };

  deleteFriend = async (friendId: number | string, signal: AbortSignal) => {
    const { data } = await $authHost.delete("/delete-friend/" + friendId, {
      signal,
    });
    return data;
  };

  getFriendship = async (
    friendId: number | string,
    signal: AbortSignal
  ): Promise<{ is_friend: boolean; is_request_sent: boolean }> => {
    const { data } = await $authHost.get("/friendship/" + friendId, {
      signal,
    });
    return data;
  };

  getAcceptedFriends = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-accepted-friends", {
      signal,
    });
    return data;
  };

  getSendedRequests = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-sended-requests", {
      signal,
    });
    return data;
  };

  getSubscribers = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-subscribers", {
      signal,
    });
    return data;
  };

  getAcceptedFriendsByNameAndSurname = async (
    search: string,
    signal: AbortSignal
  ) => {
    const { data } = await $authHost.get(
      "/get-accepted-friends-by-name-and-surname/" + search,
      {
        signal,
      }
    );
    return data;
  };

  getRejectedRequests = async (signal: AbortSignal) => {
    const { data } = await $authHost.get("/get-rejected-requests", {
      signal,
    });
    return data;
  };

  logoutFromAccount = async (signal: AbortSignal) => {
    const { data } = await $authHost.post("/logout", {
      signal,
    });
    return data;
  };

  test = async (signal: AbortSignal) => {
    const { data } = await $host.post(
      "/test",
      {},
      {
        //withCredentials: true,
        signal,
      }
    );
    return data;
  };
}

const userApi = new UserApi();
export default userApi;
