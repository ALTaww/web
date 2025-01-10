import React from "react";
import { notificationStatuses } from "../utils/consts";
import "./notification.css";

const Notification = ({
  message,
  status = notificationStatuses.success,
  onClose,
  style,
}) => {
  return (
    <div className={`notification ${status}`} style={style}>
      {typeof message === "string" ? <span>{message}</span> : message}
      <div className="close" onClick={onClose}>
        x
      </div>
    </div>
  );
};

export default Notification;
