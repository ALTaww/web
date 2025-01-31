import React, { useEffect, useRef } from "react";
import NewTrips from "../components/NewTrips";
import TripSearch from "../components/TripSearch";
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import { paths } from "./paths";
import { showNotification } from "../utils/helpers";
import userStore from "../store/userStore";
import userApi from "../http/userApi";
import { createNewAbortController } from "../utils/createNewAbortController";
import { fetchWithAbort } from "../utils/fetchWithAbort";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const abortControllerRef = useRef<AbortController>(null);

  const type = queryParams.get("type");
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const device_id = queryParams.get("device_id");

  async function createUser(
    code: string,
    state: string,
    device_id: string,
    signal: AbortSignal
  ) {
    try {
      const code_verifier = await fetchWithAbort(
        (signal) => userApi.getHttpOnlyCookie("codeVerifier", signal),
        signal
      );
      const userInfo = await fetchWithAbort(
        (signal) =>
          userApi.createOrLoginUser(
            code,
            state,
            device_id,
            code_verifier,
            signal
          ),
        signal
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
    }
  }

  useEffect(() => {
    if (type && code && state && device_id) {
      const { controller, signal } =
        createNewAbortController(abortControllerRef);
      abortControllerRef.current = controller;

      createUser(code, state, device_id, signal).finally(() => {
        navigate(paths.Home, { replace: true });
        abortControllerRef.current = null;
      });
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [type, code, state, device_id, navigate]);

  return (
    <div className="home-page page">
      <TripSearch />
      <NewTrips />
    </div>
  );
};

export default Home;
