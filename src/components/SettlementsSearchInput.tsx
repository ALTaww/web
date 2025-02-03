import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { debouncedGetSettlements } from "../utils/helpers";
import SearchInput from "../templates/SearchInput";
import { ISuggestions } from "../types/types";

interface IComponent extends React.InputHTMLAttributes<HTMLInputElement> {
  nosuggestions?: boolean;
  saveData: (place: ISuggestions) => void;
  suggestions?: ISuggestions[];
}

const SettlementsSearchInput: FC<IComponent> = ({
  nosuggestions,
  saveData,
  suggestions,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [suggestionsArray, setSuggestionsArray] = useState<ISuggestions[]>([]);

  useEffect(() => {
    setSuggestionsArray(suggestions || []);
  }, [suggestions]);

  const [isActive, setIsActive] = useState(false);

  const abortControllerRef = useRef<AbortController>(null);

  const changeInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    try {
      if (e.target.value.length > 1 && isActive && !nosuggestions) {
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

  const handleSelect = (place: ISuggestions) => {
    saveData(place);
    setValue(place.value);
    setIsActive(false);
  };

  return (
    <div className="search-input-container">
      <SearchInput
        data-testid="search-input"
        value={value}
        onChange={changeInputValue}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        {...props}
      />
      <div className="suggestions-wrapper">
        {isActive && !nosuggestions && value.length > 1 && (
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
