import React, { useState } from "react";
import SearchInput from "../components/SearchInput";
import {
  getRoute,
  getSettlementsByRoute,
} from "../http/otherApi/directionsApi";
import { decode } from "@googlemaps/polyline-codec";
import { settlementTypes } from "../utils/consts";
import ComponentHeader from "../components/ComponentHeader";

const MakeTrips = () => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [passengersNumber, setPassengersNumber] = useState("");
  const [price, setPrice] = useState("");

  const [fromLon, setFromLon] = useState("");
  const [fromLat, setFromLat] = useState("");
  const [toLon, setToLon] = useState("");
  const [toLat, setToLat] = useState("");

  const [settlementsData, setSettlementsData] = useState([]);
  const selectedSettlements = new Set();

  function setFromData(place) {
    setFromLon(place.data.geo_lon);
    setFromLat(place.data.geo_lat);
    setFromValue(place.value);
  }

  function setToData(place) {
    setToLon(place.data.geo_lon);
    setToLat(place.data.geo_lat);
    setToValue(place.value);
  }

  async function createTrips(e) {
    e.preventDefault();
    const points = await getRoute([
      [fromLon, fromLat],
      [toLon, toLat],
    ]);

    const settlements = await getSettlementsByRoute(points.polyline);
    console.log(settlements);
    setSettlementsData(settlements);
    settlements.forEach((settlement) => {
      selectedSettlements.add(`${settlement.lon},${settlement.lat}`);
    });
  }

  async function toggleSettlement(e) {
    const element = e.target.value;
    if (selectedSettlements.has(element)) {
      selectedSettlements.delete(element);
    } else {
      selectedSettlements.add(element);
    }
  }

  async function saveTrip(e) {
    e.preventDefault();
  }

  return (
    <div className="container">
      <h3>Создать новые поездки</h3>
      <form method="POST">
        <label id={"from"}>Откуда:</label>
        <SearchInput
          id={"from"}
          placeholder="Откуда"
          func={{ setTripData: setFromData }}
        />
        <label id={"to"}>Куда:</label>
        <SearchInput
          id={"to"}
          placeholder="Куда"
          func={{ setTripData: setToData }}
        />
        <label id={"when"}>Когда:</label>
        <SearchInput
          id={"when"}
          type="date"
          placeholder="Когда"
          nosuggestions={true}
          value={whenValue}
          onChange={(e) => setWhenValue(e.target.value)}
        />
        <label id={"seats"}>Количество человек:</label>
        <SearchInput
          id={"seats"}
          type="number"
          nosuggestions={true}
          value={passengersNumber}
          onChange={(e) => setPassengersNumber(e.target.value)}
        />
        <label id={"price"}>Цена:</label>
        <SearchInput
          id={"price"}
          type="number"
          nosuggestions={true}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" onClick={createTrips}>
          Создать
        </button>
      </form>
      {settlementsData.length > 0 && (
        <div className="settlements-container">
          <ComponentHeader>
            Выберите населенные пункты из которых готовы забрать пассажиров
          </ComponentHeader>
          <form method="POST" className="settlements">
            {settlementsData.map((settlement, idx) => (
              <p key={idx} className="settlement" onClick={toggleSettlement}>
                <input
                  type="checkbox"
                  id={idx}
                  value={settlement.lon + "," + settlement.lat}
                />
                <label for={idx}>
                  <span className="settlement-name">{settlement.name}</span>,{" "}
                  <span className="settlement-type">
                    {settlementTypes(settlement.type)}
                  </span>
                </label>
              </p>
            ))}
            <button type="submit" onClick={saveTrip}>
              Создать поездку
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MakeTrips;
