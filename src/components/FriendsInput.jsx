import React, { Suspense, useState } from "react";
import UserChecks from "./UserChecks";
import { findFriends, getAvatar, getFullName } from "../utils/helpers";
import { avatarSizes } from "../utils/consts";
import { observer } from "mobx-react";
import bookingStore from "../store/bookingStore";

const FriendsInput = (props) => {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showedArray, setShowedArray] = useState(bookingStore.passengersData);
  const [selectedUserId, setSelectedUserId] = useState(null);

  function searchFriends(value) {
    const friends = findFriends(value, bookingStore.passengersData);
    setShowedArray(friends);
    setIsActive(true);
  }

  return (
    <div className="user-input">
      <input
        type={props.type || "search"}
        placeholder={props.placeholder || "Введите имя друга"}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          bookingStore.deleteError(selectedUserId);
        }}
        onFocus={() => setIsActive(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            searchFriends(value);
          }
        }}
        required={props.required ? true : false}
        style={{
          borderColor: bookingStore.errors.includes(selectedUserId)
            ? "red"
            : "",
        }}
      />
      <button
        type="button"
        className="search-friend"
        onClick={(e) => searchFriends(value)}
      >
        Искать
      </button>
      {isActive && (
        <ul className="users-popup">
          {showedArray.length === 0 && <div>Друзья не найдены</div>}
          {showedArray.map((user, i) => (
            <li
              key={i}
              className="user-common-info"
              onClick={() => {
                const result = bookingStore.changePassengerId(i + 1, user.id);
                if (!result.success) return;
                setValue(getFullName(user.name, user.surname));
                setIsActive(false);
                setSelectedUserId(user.id);
              }}
            >
              <img
                src={getAvatar(user.avatar, avatarSizes.smallest)}
                aria-label="Аватар"
              />
              {getFullName(user.name, user.surname)}
              <UserChecks
                is_banned={user.is_banned}
                is_verified_by_admin={user.is_verified_by_admin}
                is_verified_by_vk={user.is_verified_by_vk}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default observer(FriendsInput);
