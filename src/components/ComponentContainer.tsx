import React, { FC } from "react";
import "../css/component-container.css";

interface IComponent extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const ComponentContainer: FC<IComponent> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={`container`}>
      <div
        className={`container-body component-container${
          className ? " " + className : ""
        }`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default ComponentContainer;
