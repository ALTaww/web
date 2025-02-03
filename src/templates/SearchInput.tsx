import React, { FC, useState } from "react";
import "../css/search-input.css";

interface IComponent extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput: FC<IComponent> = ({ className, ...props }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <input
      type={"search"}
      placeholder={""}
      className={(className ? className + " " : "") + "search-input"}
      required
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        props.onChange?.(e);
      }}
      {...props}
    />
  );
};

export default SearchInput;
