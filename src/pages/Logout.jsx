import React, { useContext } from "react";
import { logoutFromAccount } from "../http/userApi";
import { useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { Context } from "..";
import { showNotification } from "../utils/helpers";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";

const Logout = () => {
  const navigate = useNavigate();
  const { userStore } = useContext(Context);

  async function logout() {
    try {
      const response = await logoutFromAccount();
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
