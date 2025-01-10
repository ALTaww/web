import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Context } from "..";
import { userRoles } from "../utils/consts";
import {
  adminRoutes,
  driverRoutes,
  passengerRoutes,
  publicRoutes,
} from "../routes";
import { observer } from "mobx-react";
import userStore from "../store/userStore";

const AppRouter = () => {
  const userRole = userStore.data.role;
  console.log(userRole);

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {userRole === userRoles.passenger &&
        passengerRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {userRole === userRoles.driver &&
        driverRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {userRole === userRoles.admin &&
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
    </Routes>
  );
};

export default observer(AppRouter);
