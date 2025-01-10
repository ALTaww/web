import React, { useState } from "react";
import { getAvatar, getFullName, showNotification } from "../utils/helpers";
import {
  avatarSizes,
  notificationStatuses,
  notificationTimeouts,
} from "../utils/consts";
import UserChecks from "./UserChecks";
import { Link } from "react-router-dom";
import { paths } from "../pages/paths";
import { addFriend, deleteFriend } from "../http/userApi";

const FriendsList = ({ friends = [], is_friend }) => {
  const [isFriend, setIsFriend] = useState(is_friend);
  const toggleFriend = async (event) => {
    try {
      let res = {};
      if (isFriend) {
        res = await deleteFriend(event.target.id);
      } else {
        res = await addFriend(event.target.id);
      }
      setIsFriend((prev) => !prev);

      showNotification(res.message, notificationTimeouts.short);
    } catch (err) {
      console.error(err);
      showNotification(
        err.response.data.message,
        notificationTimeouts.normal,
        notificationStatuses.error
      );
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
