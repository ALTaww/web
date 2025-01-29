import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRouter from "./components/AppRouter";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import Loading from "./components/Loading";
import { pageNames } from "./pages/pageNames";
import userStore from "./store/userStore";
import userApi from "./http/userApi";
import { fetchWithAbort } from "./utils/fetchWithAbort";
import "./css/App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        if (!userStore.isAuth) {
          const userId = await fetchWithAbort(
            (signal) => userApi.getUserId(signal),
            signal
          );

          if (userId) {
            const userInfo = await fetchWithAbort(
              (signal) => userApi.getUser(userId, signal),
              signal
            );

            if (userInfo?.id) {
              userStore.setIsAuth(true);
              userStore.setData(userInfo);
            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
      <Footer />
      <div id="notification-container"></div>
    </BrowserRouter>
  );
}

export default observer(App);
