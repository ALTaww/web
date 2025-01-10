import Notification from "../components/Notification";
import Popup from "../components/Popup";
import { notificationStatuses } from "./consts";
import ReactDOM from "react-dom/client";

export function isDate(str) {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

export const getAvatar = (url, size) => {
  if (typeof url !== "string" || typeof size !== "number") return null;
  const index = url.indexOf("cs=") + 3;
  if (index === -1) return null;
  return url.slice(0, index) + `${size}x${size}`;
};

export const normilizeDate = (date) => {
  date = new Date(date);
  return date.toLocaleString("ru").slice(0, 10);
};

export const normilizeDateWithHourAndMins = (date) => {
  date = new Date(date);
  return date.toLocaleString("ru").slice(0, 17);
};

export const toggleActive = (event) => {
  event.target.closest(".active-handler")?.classList.toggle("active");
};

export const showNotification = (
  message,
  timeout = null,
  status = notificationStatuses.success
) => {
  const notificationContainer = document.querySelector(
    "#notification-container"
  );
  const div = document.createElement("div");
  const notificationElement = (
    <Notification message={message} status={status} onClose={onClose} />
  );

  notificationContainer.append(div);
  const root = ReactDOM.createRoot(div);
  root.render(notificationElement);

  function onClose() {
    root.unmount();
    div.remove();
  }

  if (timeout) {
    setTimeout(() => {
      div.classList.add("fade");
    }, timeout - 2000);
    setTimeout(onClose, timeout);
  }
};

export const showPopup = (event, text) => {
  const popupElement = (
    <Popup
      text={text}
      x_center={event.target.offsetLeft + event.target.offsetWidth / 2}
      y={event.target.offsetTop}
    />
  );
  const popupContainer = document.createElement("div");
  document.body.appendChild(popupContainer);
  const root = ReactDOM.createRoot(popupContainer);
  root.render(popupElement);

  event.target.addEventListener("mouseleave", () => {
    root.unmount();
    popupContainer.remove();
  });
};

let timeoutId;
export const debounce = (func, delay = 500) => {
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export function getFullName(name, surname) {
  return `${name} ${surname}`.trim();
}

export function findFriends(searchValue, friendsData) {
  const regex = new RegExp(searchValue, "i");
  const friends = friendsData.filter(
    (user) =>
      regex.test(`${user.name} ${user.surname}`) ||
      regex.test(`${user.surname} ${user.name}`)
  );
  return friends;
}

export function getGrammaticalEnding(number, wordsArr) {
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    let options = [2, 0, 1, 1, 1, 2];
    return wordsArr[
      lastTwoDigits > 4 && lastTwoDigits < 20
        ? 2
        : options[lastDigit < 5 ? lastDigit : 5]
    ];
  }
  return wordsArr[1];
}
