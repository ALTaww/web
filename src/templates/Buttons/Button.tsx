import React, { FC } from "react";
import "../../css/button.css";

interface IButton {
  background: string;
  border: string;
  children: React.ReactNode;
}

const Button: FC<IButton> = ({ background, border, children }) => {
  return <button className="btn">{children}</button>;
};

export default Button;
