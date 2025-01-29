import React, { FC } from "react";

interface IComponent {
  className?: string;
  children: React.ReactNode;
}

const ComponentContainer: FC<IComponent> = ({ className, children }) => {
  return (
    <div className={`container`}>
      <div
        className={`container-body component-container${
          className ? " " + className : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ComponentContainer;
