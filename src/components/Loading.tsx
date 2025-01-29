import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Loading = ({ type = "classic" }) => {
  return (
    <div className="loading">
      {type === "classic" && <Icon icon="eos-icons:loading" />}
      {type === "circle-dots" && <Icon icon="eos-icons:bubble-loading" />}
      {type === "dots" && <Icon icon="eos-icons:three-dots-loading" />}
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
