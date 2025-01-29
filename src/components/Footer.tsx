import React from "react";
import { Link } from "react-router-dom";
import { paths } from "../pages/paths";
import ComponentContainer from "./ComponentContainer";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer>
      <ComponentContainer>
        <Link to={paths.Home}>Главная</Link>
        <Link to={paths.Profile}>Профиль</Link>
        <Link to={paths.Trips}>Все поездки</Link>
        <Link to={paths.MakeTrips}>Создать поездку</Link>
        <Link to={paths.UserTrips}>UserTrips</Link>
      </ComponentContainer>
    </footer>
  );
};

export default Footer;
