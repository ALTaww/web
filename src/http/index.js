import axios from "axios";
import { showNotification } from "../utils/helpers";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import userApi from "./userApi";

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
});

const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
});

$authHost.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.credentials = "include"; // Это для явного указания передачи куков
  return config;
});

let retryCount = 0;
$authHost.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (error.response.status === 401 && error.config && !retryCount) {
      const originalRequest = error.config;
      retryCount = 1;

      try {
        await userApi.refreshTokens();
        return await $authHost.request(originalRequest);
      } catch (err) {
        showNotification(
          err.message || "Для этой операции нужно зарегистрироваться",
          notificationTimeouts.short,
          notificationStatuses.error
        );
        throw err;
      }
    }

    throw error;
  }
);

const $driverHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/driver",
});

$driverHost.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

let retryCountDriver = 0;
$driverHost.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (error.response.status === 401 && error.config && !retryCountDriver) {
      const originalRequest = error.config;
      retryCountDriver = 1;

      try {
        await userApi.refreshTokens();
        return await $driverHost.request(originalRequest);
      } catch (err) {
        showNotification(
          err.response.data.message || "Не авторизован",
          notificationTimeouts.short,
          notificationStatuses.error
        );
        throw err;
      }
    }

    if (error.response.status === 403 && error.config) {
      showNotification(
        "Чтобы сделать этот запрос, нужно обладать правами водителя",
        notificationTimeouts.short,
        notificationStatuses.error
      );
    }

    throw error;
  }
);

const $adminHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api/admin",
});

$adminHost.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

let retryCountAdmin = 0;
$adminHost.interceptors.response.use(
  (config) => config,
  async (error) => {
    if (error.response.status === 401 && error.config && !retryCountAdmin) {
      const originalRequest = error.config;
      retryCountAdmin = 1;

      try {
        await userApi.refreshTokens();
        return await $adminHost.request(originalRequest);
      } catch (err) {
        showNotification(
          err.response.data.message || "Не авторизован",
          notificationTimeouts.short,
          notificationStatuses.error
        );
        throw err;
      }
    }

    if (error.response.status === 403 && error.config) {
      showNotification(
        "Этот запрос могут делать только администраторы",
        notificationTimeouts.short,
        notificationStatuses.error
      );
    }

    throw error;
  }
);

export { $host, $authHost, $driverHost, $adminHost };
