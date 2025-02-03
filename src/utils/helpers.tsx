import { ChangeEvent } from "react";
import Notification from "../templates/Notification";
import Popup from "../templates/Popup";
import { IUsers } from "../types/database";
import { notificationStatuses } from "./consts";
import ReactDOM from "react-dom/client";
import { INotificationStatuses, ISuggestions } from "../types/types";
import { fetchWithAbort } from "./fetchWithAbort";
import suggestionsApi from "../http/otherApi/suggestionsApi";
import { createNewAbortController } from "./createNewAbortController";

export function isDate(str: string) {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

export const getAvatar = (url: string, size: number): string => {
  if (typeof url !== "string" || typeof size !== "number") return "";
  const index = url.indexOf("cs=") + 3;
  if (index === 2) return ""; // не найдено
  const afterParams = url.indexOf("&", index);
  return url.slice(0, index) + `${size}x${size}` + url.slice(afterParams);
};

export const normilizeDate = (date: Date) => {
  date = new Date(date);
  return date.toLocaleString("ru").slice(0, 10);
};

export const normilizeDateWithHourAndMins = (date: Date | string) => {
  date = new Date(date);
  return date.toLocaleString("ru").slice(0, 17);
};

export const toggleActive = (
  event: React.MouseEvent<HTMLElement> | ChangeEvent
) => {
  if (!(event.target instanceof HTMLElement)) return;
  event.target.closest(".active-handler")?.classList.toggle("active");
};

export const showNotification = (
  message: string | React.ReactNode,
  timeout: number | null = null,
  status: INotificationStatuses = notificationStatuses.success
) => {
  const notificationContainer = document.querySelector(
    "#notification-container"
  );
  if (!notificationContainer) return;
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

export const showPopup = (
  event:
    | React.MouseEvent<HTMLElement>
    | MouseEvent
    | React.ChangeEvent<HTMLElement>,
  text: string | React.ReactNode
) => {
  if (!(event.target instanceof HTMLElement)) return;
  const target = event.target;
  const popupElement = (
    <Popup
      text={text}
      x_center={target.offsetLeft + target.offsetWidth / 2}
      y={target.offsetTop}
    />
  );
  const popupContainer = document.createElement("div");
  document.body.appendChild(popupContainer);
  const root = ReactDOM.createRoot(popupContainer);
  root.render(popupElement);

  target.addEventListener("mouseleave", () => {
    root.unmount();
    popupContainer.remove();
  });
};

let timeoutId: ReturnType<typeof setTimeout>;
export const debounce = (func: Function, delay = 500) => {
  return (...args: unknown[]) => {
    const isAsync = func.constructor.name === "AsyncFunction";

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (isAsync) {
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func(...args);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }, delay);
      });
    } else {
      timeoutId = setTimeout(() => func(...args), delay);
    }
  };
};

export function getFullName(name: string, surname: string) {
  return `${name} ${surname}`.trim();
}

export function findFriends(
  searchValue: string,
  friendsData: (IUsers | { name: string; surname: string })[]
): (IUsers | { name: string; surname: string })[] {
  const regex = new RegExp(searchValue, "i");
  const friends = friendsData.filter(
    (user) =>
      regex.test(`${user.name} ${user.surname}`) ||
      regex.test(`${user.surname} ${user.name}`)
  );
  return friends;
}

export function getGrammaticalEnding(number: number, wordsArr: string[]) {
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

export const debouncedGetSettlements = debounce(
  async (
    value: string,
    abortControllerRef: React.RefObject<AbortController | null>
  ) => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    if (value.length > 1) {
      const data = await fetchWithAbort(
        (signal) => suggestionsApi.getSettlements(value, signal),
        signal
      );
      console.log(value, data);
      abortControllerRef.current = null;

      return data;
    }
    return [];
  },
  500
) as (
  value: string,
  abortControllerRef: React.RefObject<AbortController | null>
) => Promise<ISuggestions[]>;
