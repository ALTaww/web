import React from "react";

const ComponentHeader = (props) => {
  return (
    <h3 {...props} className={"component-header " + props.className}>
      {props.children}
    </h3>
  );
};

export default ComponentHeader;
