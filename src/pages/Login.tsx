import React, { useContext, useEffect } from "react";
import * as VKID from "@vkid/sdk";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { Context } from "..";
import { observer } from "mobx-react";
import userStore from "../store/userStore";
import userApi from "../http/userApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";

const Login = () => {
  // При нажатии кнопки юзера редиректит на главную
  useEffect(() => {
    if (userStore.isAuth) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const { config: vkConfig, codeVerifier } = await fetchWithAbort(
          (signal) => userApi.generateVkConfig(signal),
          signal
        );
        VKID.Config.init({
          mode: VKID.ConfigAuthMode.InNewTab, // По умолчанию авторизация открывается в новой вкладке.
          ...vkConfig,
        });

        await fetchWithAbort(
          (signal) =>
            userApi.setHttpOnlyCookie("codeVerifier", codeVerifier, 60, signal),
          signal
        );
        // Создание экземпляра кнопки.
        const oneTap = new VKID.OneTap();

        // Получение контейнера из разметки.
        const container = document.getElementById("VkIdSdkOneTap");

        const handleError = (err) => {
          console.log(err);
        };

        // Проверка наличия кнопки в разметке.
        if (container) {
          // Отрисовка кнопки в контейнере с именем приложения APP_NAME, светлой темой и на русском языке.
          oneTap
            .render({
              container: container,
              scheme: VKID.Scheme.LIGHT,
              lang: VKID.Languages.RUS,
              showAlternativeLogin: true,
            })
            .on(VKID.WidgetEvents.ERROR, handleError);
        }
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, [userStore.isAuth]);

  if (userStore.isAuth) {
    return (
      <div>
        <h2>Вы уже авторизованы</h2>
        <Link to={paths.Logout} type="button">
          Выйти
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Авторизуйтесь с помощью VK ID</h1>
      <div id="VkIdSdkOneTap"></div>
      <Link to={paths.WhyVkId}>Почему VK ID?</Link>
    </div>
  );
};

export default observer(Login);
