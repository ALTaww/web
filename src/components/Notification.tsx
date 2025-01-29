import React, { CSSProperties, FC } from "react";
import { notificationStatuses } from "../utils/consts";
import "./notification.css";
import { INotificationStatuses } from "../types/types";

interface IComponent {
  status: INotificationStatuses;
  message: string;
  onClose: () => {};
  style: CSSProperties;
}

const Notification: FC<IComponent> = ({
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
