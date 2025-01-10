import React, { useRef, useState } from "react";
import { getAvatar, getFullName, showNotification } from "../utils/helpers";
import {
  avatarSizes,
  notificationStatuses,
  notificationTimeouts,
} from "../utils/consts";
import UserChecks from "./UserChecks";
import { Link } from "react-router-dom";
import { paths } from "../pages/paths";
import userApi from "../http/userApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { createNewAbortController } from "../utils/createNewAbortController";

const FriendsList = ({ friends = [], is_friend }) => {
  const [isFriend, setIsFriend] = useState(is_friend);

  const abortControllerRef = useRef(null);

  const toggleFriend = async (event) => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      let res = {};
      if (isFriend) {
        res = await fetchWithAbort(
          (signal) => userApi.deleteFriend(event.target.id, signal),
          signal
        );
      } else {
        res = await fetchWithAbort(
          (signal) => userApi.addFriend(event.target.id, signal),
          signal
        );
      }
      setIsFriend((prev) => !prev);

      showNotification(res.message, notificationTimeouts.short);
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || "Error occurred",
        notificationTimeouts.normal,
        notificationStatuses.error
      );
    } finally {
      abortControllerRef.current = null;
    }
  };
  return (
    <div className="friends-list">
      {friends.length < 1 && <p>Совпадений нет</p>}
      {friends.length > 0 &&
        friends.map((friend, i) => (
          <div key={i} className="friends-list-item">
            <img
              src={getAvatar(friend.avatar, avatarSizes.small)}
              alt="Фото"
              className="avatar"
            />
            <Link to={paths.Profile + "/" + friend.id} className="name">
              {getFullName(friend.name, friend.surname)}
              <UserChecks
                is_banned={friend.is_banned}
                is_verified_by_admin={friend.is_verified_by_admin}
                is_verified_by_vk={friend.is_verified_by_vk}
              />
            </Link>
            {typeof isFriend === "boolean" && (
              <button type="button" onClick={toggleFriend} id={friend.id}>
                {isFriend ? "Удалить из друзей" : "Добавить в друзья"}
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default FriendsList;
