import React, { useRef, useState } from "react";
import { debounce } from "../utils/helpers";
import { createNewAbortController } from "../utils/createNewAbortController";
import suggestionsApi from "../http/otherApi/suggestionsApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import SearchInput from "./SearchInput";

const SettlementsSearchInput = ({
  nosuggestions,
  saveData,
  suggestions,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [suggestionsArray, setSuggestionsArray] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const abortControllerRef = useRef(null);

  const debouncedGetSettlements = debounce(async (value) => {
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

  const changeInputValue = async (e) => {
    setValue(e.target.value);
    try {
      if (e.target.value.length > 1 && isActive) {
        const data = await debouncedGetSettlements(e.target.value);
        console.log("data: ", data);
        setSuggestionsArray(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setData = async (place) => {
    setValue(place.value);
    setSuggestionsArray([place]);
    saveData(place);
  };

  const handleSelect = (place) => {
    saveData(place);
    setValue(place.value);
    setIsActive(false);
  };

  return (
    <div className="search-input-container">
      <SearchInput
        value={value}
        suggestions={suggestions}
        onChange={changeInputValue}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        {...props}
      />
      <div className="suggestions-wrapper">
        {isActive && !nosuggestions && (
          <div className="search-suggestions">
            {suggestionsArray.map((suggestion, index) => (
              <div
                key={index}
                className="search-suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(suggestion)}
              >
                <p>{suggestion.value}</p>
              </div>
            ))}
            {suggestionsArray.length === 0 && isActive && (
              <div className="search-suggestion disabled">
                <p>Нет совпадений</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementsSearchInput;
