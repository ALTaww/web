import React, { ButtonHTMLAttributes, FC } from "react";
import "../../css/button.css";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  border?: string;
  children: React.ReactNode;
}

const Button: FC<IButton> = ({ background, border, children, ...props }) => {
  return (
    <button
      className={`btn${props.className ? " " + props.className : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
