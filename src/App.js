import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRouter from "./components/AppRouter";
import { useContext, useEffect, useState } from "react";
import { Context } from ".";
import { getUser, getUserId } from "./http/userApi";
import { observer } from "mobx-react";
import Loading from "./components/Loading";
import { pageNames } from "./pages/pageNames";
import userStore from "./store/userStore";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        if (!userStore.isAuth) {
          const userId = await getUserId();
          const userInfo = await getUser(userId);
          if (userInfo.id) {
            userStore.setIsAuth(true);
            userStore.setData(userInfo);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
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
