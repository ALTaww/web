import React, { useState } from "react";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { paths } from "../pages/paths";
import { isDate, showNotification } from "../utils/helpers";
import { observer } from "mobx-react";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import tripStore from "../store/tripStore";
import suggestionsApi from "../http/otherApi/suggestionsApi";

const TripSearch = (props) => {
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const navigate = useNavigate();

  const searchTrip = (e) => {
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
        `${paths.Searchresults}?from=${tripStore.from}&to=${tripStore.to}&when=${tripStore.when}`,
        {
          replace: true,
        }
      );
    } else {
      showNotification(
        "Пожалуйста выберите один из предложенных населенных пунктов в списках, а также желаемую дату",
        notificationTimeouts.normal,
        notificationStatuses.error
      );
    }
  };

  const changeFromValue = async (e) => {
    try {
      tripStore.setFrom(e.target.value);
      if (e.target.value.length > 1) {
        const data = await suggestionsApi.getSettlements(e.target.value);
        setFromSuggestions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeToValue = async (e) => {
    try {
      tripStore.setTo(e.target.value);
      if (e.target.value.length > 1) {
        const data = await suggestionsApi.getSettlements(e.target.value);
        setToSuggestions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setFromData = async (place) => {
    tripStore.setFrom(place.value);
    tripStore.setFromLat(place.data.geo_lat);
    tripStore.setFromLon(place.data.geo_lon);
  };

  const setToData = async (place) => {
    tripStore.setTo(place.value);
    tripStore.setToLat(place.data.geo_lat);
    tripStore.setToLon(place.data.geo_lon);
  };

  return (
    <div className="trip-search-container">
      <p>Город / населенный пункт:</p>

      <div id="trip-search">
        <SearchInput
          placeholder={"Откуда"}
          id="direction-from"
          aria-label="Введите начальный пункт направления"
          value={tripStore.from}
          suggestions={JSON.stringify(fromSuggestions)}
          //onChange={changeFromValue}
          func={{ setTripData: setFromData }}
        />
        <label className="fake" htmlFor="direction-from">
          Откуда
        </label>
        <SearchInput
          placeholder={"Куда"}
          id="direction-to"
          aria-label="Введите конечный пункт"
          value={tripStore.to}
          suggestions={JSON.stringify(toSuggestions)}
          //onChange={changeToValue}
          func={{ setTripData: setToData }}
        />
        <label className="fake" htmlFor="direction-to">
          Куда
        </label>
        <SearchInput
          type="date"
          id="trip-when"
          placeholder="Когда"
          value={tripStore.when}
          nosuggestions={true}
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
  );
};

export default observer(TripSearch);
