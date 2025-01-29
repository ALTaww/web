import React, { FC, useEffect, useRef, useState } from "react";
import "../css/search-input.css";

interface IComponent {
  className?: string;
}

const SearchInput: FC<IComponent> = ({ className, ...props }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <input
      type={"search"}
      placeholder={""}
      className={className + " search-input"}
      required
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      {...props}
    />
  );
};

export default SearchInput;
