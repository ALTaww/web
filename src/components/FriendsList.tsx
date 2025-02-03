import React, { FC, useRef, useState } from "react";
import { getAvatar, getFullName, showNotification } from "../utils/helpers";
import {
  avatarSizes,
  notificationStatuses,
  notificationTimeouts,
} from "../utils/consts";
import UserChecks from "../templates/UserChecks";
import { Link } from "react-router-dom";
import { paths } from "../pages/paths";
import userApi from "../http/userApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { createNewAbortController } from "../utils/createNewAbortController";
import { IUsers } from "../types/database";
import { AxiosError } from "axios";
import Button from "../templates/Buttons/Button";

interface IComponent {
  friends: IUsers[];
  is_friend: boolean | null;
}

const FriendsList: FC<IComponent> = ({ friends = [], is_friend }) => {
  const [isFriend, setIsFriend] = useState(is_friend);

  const abortControllerRef = useRef<AbortController>(null);

  const toggleFriend = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    const button = event.target as HTMLButtonElement;

    try {
      let res: { message: string } = { message: "" };
      if (isFriend) {
        res = await fetchWithAbort(
          (signal) => userApi.deleteFriend(button.id, signal),
          signal
        );
      } else {
        res = await fetchWithAbort(
          (signal) => userApi.addFriend(button.id, signal),
          signal
        );
      }
      setIsFriend((prev) => !prev);

      showNotification(res.message, notificationTimeouts.short);
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError) {
        showNotification(
          err.response?.data?.message || "Error occurred",
          notificationTimeouts.short,
          notificationStatuses.error
        );
      } else {
        console.error(err);
        showNotification(
          "Unexpected error occurred",
          notificationTimeouts.short,
          notificationStatuses.error
        );
      }
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
              <Button type="button" onClick={toggleFriend} id={`${friend.id}`}>
                {isFriend ? "Удалить из друзей" : "Добавить в друзья"}
              </Button>
            )}
          </div>
        ))}
    </div>
  );
};

export default FriendsList;
