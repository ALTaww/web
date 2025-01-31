import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import SearchInput from "../components/SearchInput";

import { decode } from "@googlemaps/polyline-codec";
import {
  notificationStatuses,
  notificationTimeouts,
  settlementTypes,
} from "../utils/consts";
import ComponentHeader from "../components/ComponentHeader";
import directionsApi from "../http/otherApi/directionsApi";
import { createNewAbortController } from "../utils/createNewAbortController";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import Button from "../templates/Buttons/Button";
import SettlementsSearchInput from "../components/SettlementsSearchInput";
import { showNotification } from "../utils/helpers";
import { ISettlements, ISuggestions } from "../types/types";

const MakeTrips = () => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [passengersNumber, setPassengersNumber] = useState("");
  const [price, setPrice] = useState("");

  const [fromLon, setFromLon] = useState<number>();
  const [fromLat, setFromLat] = useState<number>();
  const [toLon, setToLon] = useState<number>();
  const [toLat, setToLat] = useState<number>();

  const [settlementsData, setSettlementsData] = useState<ISettlements[]>([]);
  const selectedSettlements = new Set<string>();

  const abortControllerRef = useRef<AbortController>(null);

  function setFromData(place: ISuggestions) {
    setFromLon(place.data.geo_lon);
    setFromLat(place.data.geo_lat);
    setFromValue(place.value);
  }

  function setToData(place: ISuggestions) {
    setToLon(place.data.geo_lon);
    setToLat(place.data.geo_lat);
    setToValue(place.value);
  }

  async function createTrips(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fromLon || !fromLat || !toLon || !toLat) {
      return showNotification(
        <p>Пожалуйста выберите населенный пункт из выпадающего списка</p>,
        notificationTimeouts.short,
        notificationStatuses.error
      );
    }

    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    const points = await fetchWithAbort(
      (signal) =>
        directionsApi.getRoute(
          [
            [fromLon, fromLat],
            [toLon, toLat],
          ],
          signal
        ),
      signal
    );

    const settlements = await fetchWithAbort(
      (signal) => directionsApi.getSettlementsByRoute(points.polyline, signal),
      signal
    );
    console.log(settlements);
    setSettlementsData(settlements);
    settlements.forEach((settlement) => {
      selectedSettlements.add(`${settlement.lon},${settlement.lat}`);
    });
    abortControllerRef.current = null;
  }

  async function toggleSettlement(e: MouseEvent) {
    if (!e.target) return;
    const element = e.target.value;
    if (selectedSettlements.has(element)) {
      selectedSettlements.delete(element);
    } else {
      selectedSettlements.add(element);
    }
  }

  async function saveTrip(e: ChangeEvent) {
    e.preventDefault();
  }

  return (
    <div className="container">
      <h3>Создать новые поездки</h3>
      <form onSubmit={(e) => createTrips(e)}>
        <div className="">
          <label id={"from"}>Откуда:</label>
          <SettlementsSearchInput
            id={"from"}
            placeholder="Откуда"
            saveData={setFromData}
          />
        </div>
        <div className="">
          <label id={"to"}>Куда:</label>
          <SettlementsSearchInput
            id={"to"}
            placeholder="Куда"
            saveData={setToData}
          />
        </div>
        <div className="">
          <label id={"when"}>Когда:</label>
          <SearchInput
            id={"when"}
            type="date"
            placeholder="Когда"
            nosuggestions={true}
            value={whenValue}
            onChange={(e) => setWhenValue(e.target.value)}
          />
        </div>
        <div className="">
          <label id={"seats"}>Количество человек:</label>
          <SearchInput
            id={"seats"}
            type="number"
            nosuggestions={true}
            value={passengersNumber}
            onChange={(e) => setPassengersNumber(e.target.value)}
          />
        </div>
        <div className="">
          <label id={"price"}>Цена:</label>
          <SearchInput
            id={"price"}
            type="number"
            nosuggestions={true}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="">
          <Button type="submit">Создать</Button>
        </div>
      </form>
      {settlementsData.length > 0 && (
        <div className="settlements-container">
          <ComponentHeader>
            Выберите населенные пункты из которых готовы забрать пассажиров
          </ComponentHeader>
          <form method="POST" className="settlements">
            {settlementsData.map((settlement, idx) => (
              <p
                key={idx}
                className="settlement"
                onClick={(e) => toggleSettlement(e)}
              >
                <input
                  type="checkbox"
                  id={`${idx}`}
                  value={settlement.lon + "," + settlement.lat}
                />
                <label htmlFor={`${idx}`}>
                  <span className="settlement-name">{settlement.name}</span>,{" "}
                  <span className="settlement-type">
                    {settlementTypes[settlement.type]}
                  </span>
                </label>
              </p>
            ))}
            <Button type="submit" onClick={saveTrip}>
              Создать поездку
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MakeTrips;
