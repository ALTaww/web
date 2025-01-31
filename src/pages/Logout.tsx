import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { Context } from "..";
import { showNotification } from "../utils/helpers";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import userStore from "../store/userStore";
import userApi from "../http/userApi";
import { createNewAbortController } from "../utils/createNewAbortController";
import { fetchWithAbort } from "../utils/fetchWithAbort";

const Logout = () => {
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController>(null);

  async function logout() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      const response = await fetchWithAbort(
        (signal) => userApi.logoutFromAccount(signal),
        signal
      );
      console.log(response);
      userStore.setIsAuth(false);
      userStore.setData({});
      navigate(paths.Home, { replace: true });
      showNotification(
        "Вы успешно вышли из аккаунта",
        notificationTimeouts.short,
        notificationStatuses.success
      );
    } catch (err) {
      console.log(err);
    } finally {
      abortControllerRef.current = null;
    }
  }
  return (
    <>
      <h2>Вы уверены что хотите выйти из своего аккаунта?</h2>
      <div>
        <button onClick={logout}>Выйти</button>
      </div>
    </>
  );
};

export default Logout;
