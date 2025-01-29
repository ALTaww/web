import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { paths } from "../pages/paths";
import { addActive, getAvatar, toggleActive } from "../utils/helpers";
import { avatarSizes } from "../utils/consts";
import "./header.css";
import profileImage from "../assets/img/icons/profile.png";
import settingsImage from "../assets/img/icons/settings.png";
import { observer } from "mobx-react";
import userStore from "../store/userStore";

const Header = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function func(e: Event) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        menuRef.current.classList.remove("active");
      }
    }
    document.addEventListener("click", func);
    return () => {
      document.removeEventListener("click", func);
    };
  }, [menuRef]);

  return (
    <header>
      <Link to={paths.Home}>Главная</Link>
      <Link
        to={
          paths.Searchresults +
          "?from=%D0%9F%D1%83%D1%81%D1%82%D1%8B%D0%BD%D1%8F&to=%D0%A9%D0%B5%D0%BB%D1%8C%D1%8F%D1%8E%D1%80&when=2024-08-13"
        }
      >
        Search
      </Link>
      <Link to={paths.Booking + "/17"}>Booking</Link>
      <Link to={paths.Login}>Login</Link>
      <Link to={paths.Admin}>Admin</Link>
      <Link to={paths.UserTrips}>UserTrips</Link>

      {userStore.isAuth && (
        <div
          onClick={toggleActive}
          ref={menuRef}
          className="menu-dropdown header-menu active-handler"
        >
          <button
            type="button"
            aria-label="Нажмите чтобы открыть меню"
            style={{ border: 0, width: "100%" }}
          >
            <img
              src={getAvatar(userStore.data.avatar, avatarSizes.smallest)}
              className="avatar"
              aria-label="Ваш аватар"
            />
          </button>
          <div className="submenu">
            <Link
              to={paths.Profile + "/" + userStore.data.id}
              className="profile-link icon-link"
            >
              Профиль
            </Link>
            <Link to={paths.Friends} className="friends-link icon-link">
              Друзья
            </Link>
            <Link to={paths.Settings} className="settings-link icon-link">
              Настройки
            </Link>
            <Link to={paths.Logout} className="logout-link icon-link">
              Выйти
            </Link>
          </div>
        </div>
      )}

      {!userStore.isAuth && <Link to={paths.Login}>Войти в аккаунт</Link>}
    </header>
  );
};

export default observer(Header);
