import bookingStore from "../store/bookingStore";
import tripStore from "../store/tripStore";
import userStore from "../store/userStore";

export const userRoles = {
  passenger: "PASSENGER",
  driver: "DRIVER",
  admin: "ADMIN",
} as const;

export const avatarSizes = {
  smallest: 32,
  small: 72,
  middle: 108,
  big: 160,
  biggest: 240,
} as const;

export const expressions = {
  is_verified_by_vk: "Проверено ВК",
  is_verified_by_admin: "Проверен администратором",
  PASSENGER: "Пассажир",
  DRIVER: "Водитель",
  ADMIN: "Администратор",
} as const;

export const vkProfileSrc = "https://vk.com/id" as const;
export const genders = {
  male: "муж.",
  female: "жен.",
} as const;

export const notificationStatuses = {
  success: "success",
  error: "error",
  classic: "classic",
} as const;

export const notificationTimeouts = {
  short: 5000,
  normal: 10000,
  large: 15000,
} as const;

export const popupTexts = {
  addFriend: "Добавить в друзья",
  deleteFriend: "Удалить из друзей",
} as const;

export const friendsPages = {
  accepted: "accepted",
  sended: "sended",
  subs: "subs",
  rejected: "rejected",
} as const;

export const grammaticalEndings = {
  //         1         4       5
  seats: ["место", "места", "мест"],
  rubles: ["рубль", "рубля", "рублей"],
};

export const settlementTypes = {
  city: "город",
  town: "город",
  village: "деревня",
  hamlet: "селение",
  suburb: "пригород",
} as const;

export const contextValue = {
  userStore,
  bookingStore,
  tripStore,
};

export const timeTypes = {
  future: "future",
  past: "past",
} as const;
