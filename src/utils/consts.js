import bookingStore from "../store/bookingStore";
import tripStore from "../store/tripStore";
import userStore from "../store/userStore";

export const userRoles = {
  passenger: "PASSENGER",
  driver: "DRIVER",
  admin: "ADMIN",
};

export const avatarSizes = {
  smallest: 32,
  small: 72,
  middle: 108,
  big: 160,
  biggest: 240,
};

export const expressions = {
  is_verified_by_vk: "Проверено ВК",
  is_verified_by_admin: "Проверен администратором",
  PASSENGER: "Пассажир",
  DRIVER: "Водитель",
  ADMIN: "Администратор",
};

export const vkProfileSrc = "https://vk.com/id";
export const genders = {
  male: "муж.",
  female: "жен.",
};

export const notificationStatuses = {
  success: "success",
  error: "error",
  classic: "classic",
};

export const notificationTimeouts = {
  short: 5000,
  normal: 10000,
  large: 15000,
};

export const popupTexts = {
  addFriend: "Добавить в друзья",
  deleteFriend: "Удалить из друзей",
};

export const friendsPages = {
  accepted: "accepted",
  sended: "sended",
  subs: "subs",
  rejected: "rejected",
};

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
};

export const contextValue = {
  userStore,
  bookingStore,
  tripStore,
};
