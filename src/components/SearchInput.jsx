import React, { useState } from "react";
import { getSettlements } from "../http/otherApi/suggestionsApi";
import "./searchInput.css";
import { debounce } from "../utils/helpers";

const SearchInput = (props) => {
  const [inputValue, setInputValue] = useState(props.value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const debouncedGetSettlements = debounce(async (value) => {
    if (!props.nosuggestions && value.length > 1) {
      const data = await getSettlements(value);
      setSuggestions(data);
      console.log(value, data);
    }
  }, 500);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedGetSettlements(value);
  };

  const handleSelect = (place) => {
    props.func?.setTripData(place);
    setInputValue(place.value);
    setIsActive(false);
  };

  return (
    <div className="search-input-container">
      <input
        type={props.type || "search"}
        placeholder={props.placeholder || ""}
        className={props.className + " search-input"}
        required
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        {...props}
      />
      <div className="suggestions-wrapper">
        {isActive && !props.nosuggestions && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="search-suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(suggestion)}
              >
                <p>{suggestion.value}</p>
              </div>
            ))}
            {suggestions.length === 0 && isActive && (
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

export default SearchInput;
