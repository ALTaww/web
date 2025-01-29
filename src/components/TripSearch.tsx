import React, { FC, useRef, useState } from "react";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { paths } from "../pages/paths";
import { debounce, isDate, showNotification } from "../utils/helpers";
import { observer } from "mobx-react";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import tripStore from "../store/tripStore";
import suggestionsApi from "../http/otherApi/suggestionsApi";
import { createNewAbortController } from "../utils/createNewAbortController";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import "../css/trip-search.css";
import { ISuggestions } from "../types/types";

interface IComponent {
  nosuggestions: boolean;
}

const TripSearch: FC<IComponent> = ({ nosuggestions }) => {
  const [fromSuggestions, setFromSuggestions] = useState<ISuggestions[]>([]);
  const [toSuggestions, setToSuggestions] = useState<ISuggestions[]>([]);

  const navigate = useNavigate();

  const abortControllerRef = useRef<AbortController>(null);

  const debouncedGetSettlements = debounce(async (value: string) => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    if (!nosuggestions && value.length > 1) {
      const data = await fetchWithAbort(
        (signal) => suggestionsApi.getSettlements(value, signal),
        signal
      );
      console.log(value, data);
      abortControllerRef.current = null;

      return data;
    }
  }, 500);

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
        const data = await debouncedGetSettlements(e.target.value);
        console.log("data: ", data);
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
        const data = await debouncedGetSettlements(e.target.value);
        console.log("data: ", data);

        setToSuggestions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setFromData = async (place: ISuggestions) => {
    tripStore.setFrom(place.value);
    tripStore.setFromLat(place.data.geo_lat);
    tripStore.setFromLon(place.data.geo_lon);
    setFromSuggestions([place]);
  };

  const setToData = async (place: ISuggestions) => {
    tripStore.setTo(place.value);
    tripStore.setToLat(place.data.geo_lat);
    tripStore.setToLon(place.data.geo_lon);
    setToSuggestions([place]);
  };

  return (
    <div className="trip-search">
      <p>Город / населенный пункт:</p>

      <div id="trip-search" className="trip-search-container">
        <SearchInput
          placeholder={"Откуда"}
          id="direction-from"
          aria-label="Введите начальный пункт направления"
          value={tripStore.from}
          suggestions={fromSuggestions}
          onChange={changeFromValue}
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
          suggestions={toSuggestions}
          onChange={changeToValue}
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
