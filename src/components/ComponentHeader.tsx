import React, { FC } from "react";

interface IComponent extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ComponentHeader: FC<IComponent> = ({ className, ...props }) => {
  return (
    <h3
      className={"component-header" + className ? " " + className : ""}
      {...props}
    >
      {props.children}
    </h3>
  );
};

export default ComponentHeader;
