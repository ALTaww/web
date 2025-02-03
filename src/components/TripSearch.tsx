import React, { FC } from "react";
import SearchInput from "../templates/SearchInput";
import { useNavigate } from "react-router-dom";
import { paths } from "../pages/paths";
import { isDate, showNotification } from "../utils/helpers";
import { observer } from "mobx-react";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import tripStore from "../store/tripStore";
import "../css/trip-search.css";
import { ISuggestions } from "../types/types";
import SettlementsSearchInput from "./SettlementsSearchInput";
import ComponentContainer from "./ComponentContainer";

const TripSearch: FC = () => {
  const navigate = useNavigate();

  const searchTrip = () => {
    console.log(
      "tripSearch clicked: ",
      tripStore.fromLat,
      tripStore.fromLon,
      tripStore.toLat,
      tripStore.toLon,
      isDate(tripStore.when)
    );
    if (
      tripStore.fromLat &&
      tripStore.fromLon &&
      tripStore.toLat &&
      tripStore.toLon &&
      isDate(tripStore.when)
    ) {
      navigate(
        `${paths.Searchresults}?from=${tripStore.from}&to=${tripStore.to}&when=${tripStore.when}`
      );
    } else {
      showNotification(
        "Пожалуйста выберите один из предложенных населенных пунктов в списках, а также желаемую дату",
        notificationTimeouts.short,
        notificationStatuses.error
      );
    }
  };

  const setFromData = async (place: ISuggestions) => {
    tripStore.setFrom(place.value);
    tripStore.setFromLat(place.data.geo_lat);
    tripStore.setFromLon(place.data.geo_lon);
  };

  const setToData = async (place: ISuggestions) => {
    tripStore.setTo(place.value);
    tripStore.setToLat(place.data.geo_lat);
    tripStore.setToLon(place.data.geo_lon);
  };

  return (
    <ComponentContainer>
      <div className="trip-search">
        <p>Город / населенный пункт:</p>

        <div id="trip-search" className="trip-search-container">
          <SettlementsSearchInput
            placeholder={"Откуда"}
            id="direction-from"
            aria-label="Введите начальный пункт направления"
            saveData={setFromData}
          />
          <label className="fake" htmlFor="direction-from">
            Откуда
          </label>
          <SettlementsSearchInput
            placeholder={"Куда"}
            id="direction-to"
            aria-label="Введите конечный пункт"
            saveData={setToData}
          />
          <label className="fake" htmlFor="direction-to">
            Куда
          </label>
          <SearchInput
            type="date"
            id="trip-when"
            placeholder="Когда"
            value={tripStore.when}
            onChange={(e) => tripStore.setWhen(e.target.value)}
          />
          <label className="fake" htmlFor="trip-when">
            Когда
          </label>
          <button onClick={searchTrip} className="find-trip">
            Найти
          </button>
        </div>
      </div>
    </ComponentContainer>
  );
};

export default observer(TripSearch);
