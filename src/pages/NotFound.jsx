import React from "react";
import { Link } from "react-router-dom";
import { paths } from "./paths";
import "./notFound.css";
import not_found_image from "../assets/img/404_not_found.jpeg";

const NotFound = () => {
  return (
    <div id="not-found">
      <div>
        <img
          src={not_found_image}
          alt="Картинка ошибки 404"
          className="text-center"
        />
        <h1 className="text-center">Такая страница не найдена :(</h1>
        <Link to={paths.Home} className="text-center">
          На главную
        </Link>
        <div className="ol-container">
          <div className="ol">
            <h2>Почему это могло произойти?</h2>
            <ol>
              <li>Страницы с таким адресом не существует или она устарела</li>
              <li>У вас нет доступа для просмотра данной страницы</li>
              <li>У нас на сервере какая-то ошибка</li>
            </ol>
          </div>
          <div className="ol">
            <h2>Что мне делать дальше?</h2>
            <ol>
              <li>Попробуйте перезагрузить страницу</li>
              <li>
                Если ошибка повторяется, пожалуйста, воспользуйтесь другими
                способами поиска нужной вам информации
              </li>
              <li>
                Или просто напишите нам. Мы обязательно решим вашу проблему.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
