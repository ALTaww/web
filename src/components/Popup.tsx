import React, { FC, useEffect, useRef } from "react";
import "./popup.css";

interface IComponent {
  text: string | React.ReactNode;
  x_center: number;
  y: number;
}

const Popup: FC<IComponent> = ({ text, x_center, y }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.style.left = `${
        x_center - popupRef.current.offsetWidth / 2
      }px`;
      popupRef.current.style.top = `${
        y - popupRef.current.offsetHeight - 10
      }px`;
    }
  }, [popupRef, x_center, y]);

  return (
    <div ref={popupRef} className="popup">
      {text}
      <div className="popup-arrow" />
    </div>
  );
};

export default Popup;
