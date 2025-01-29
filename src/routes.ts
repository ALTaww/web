import Admin from "./pages/admin/Admin";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { paths } from "./pages/paths";
import Profile from "./pages/Profile";
import Searchresults from "./pages/Searchresults";
import Settings from "./pages/Settings";
import Friends from "./pages/Friends";
import Logout from "./pages/Logout";
import UserTrips from "./pages/UserTrips";
import MakeTrips from "./pages/MakeTrips";
import Trips from "./pages/Trips";

export const publicRoutes = [
  {
    path: paths.Home,
    Component: Home,
  },
  {
    path: paths.Login,
    Component: Login,
  },
  {
    path: paths.Searchresults,
    Component: Searchresults,
  },
  {
    path: paths.Profile + "/:id",
    Component: Profile,
  },
  {
    path: paths.Booking + "/:id",
    Component: Booking,
  },
  {
    path: paths.Trips,
    Component: Trips,
  },
  {
    path: "*",
    Component: NotFound,
  },

  // passengerRoutes
  {
    path: paths.Settings,
    Component: Settings,
  },
  {
    path: paths.Friends,
    Component: Friends,
  },
  {
    path: paths.Logout,
    Component: Logout,
  },
  {
    path: paths.UserTrips,
    Component: UserTrips,
  },

  // driverRoutes
  {
    path: paths.MakeTrips,
    Component: MakeTrips,
  },

  // adminRoutes
  {
    path: paths.Admin,
    Component: Admin,
  },
];

export const passengerRoutes = [];

export const driverRoutes = [...passengerRoutes];

export const adminRoutes = [...passengerRoutes, ...driverRoutes];
