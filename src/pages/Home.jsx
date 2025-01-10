import React, { useContext, useEffect } from "react";
import NewTrips from "../components/NewTrips";
import TripSearch from "../components/TripSearch";
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { deleteCookie, getCookie, setCookie } from "../http/cookie";
import {
  createOrLoginUser,
  getAccessToken,
  getHttpOnlyCookie,
  getUsers,
} from "../http/userApi";
import { Context } from "..";
import {
  accessTokenOptions,
  notificationStatuses,
  notificationTimeouts,
} from "../utils/consts";
import { paths } from "./paths";
import { showNotification } from "../utils/helpers";

const Home = () => {
  const { userStore } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const type = queryParams.get("type");
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const device_id = queryParams.get("device_id");

  if (type && code && state && device_id) {
    createUser(code, state, device_id);
  }

  async function createUser(code, state, device_id) {
    try {
      const code_verifier = await getHttpOnlyCookie("codeVerifier");
      const userInfo = await createOrLoginUser(
        code,
        state,
        device_id,
        code_verifier
      );
      userStore.setIsAuth(true);
      userStore.setData(userInfo);
      console.log(userInfo, userStore);
      showNotification(
        "Вы успешно зашли в аккаунт",
        notificationTimeouts.short,
        notificationStatuses.success
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      navigate(paths.Home, { replace: true });
    }
  }

  return (
    <>
      <TripSearch />
      <NewTrips />
    </>
  );
};

export default Home;
