import React, { ChangeEvent, FC, useRef, useState } from "react";
import { debounce, debouncedGetSettlements } from "../utils/helpers";
import { createNewAbortController } from "../utils/createNewAbortController";
import suggestionsApi from "../http/otherApi/suggestionsApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import SearchInput from "./SearchInput";
import { ISuggestions } from "../types/types";

interface IComponent {
  nosuggestions?: boolean;
  saveData: (place: ISuggestions) => void;
  suggestions: ISuggestions[];
}

const SettlementsSearchInput: FC<IComponent> = ({
  nosuggestions,
  saveData,
  suggestions,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [suggestionsArray, setSuggestionsArray] = useState<ISuggestions[]>([]);

  const [isActive, setIsActive] = useState(false);

  const abortControllerRef = useRef<AbortController>(null);

  const changeInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    try {
      if (e.target.value.length > 1 && isActive) {
        const data = await debouncedGetSettlements(
          e.target.value,
          abortControllerRef
        );
        console.log("data: ", data);
        setSuggestionsArray(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setData = async (place: ISuggestions) => {
    setValue(place.value);
    setSuggestionsArray([place]);
    saveData(place);
  };

  const handleSelect = (place: ISuggestions) => {
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
