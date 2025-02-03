import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/profile.css";

import Loading from "../components/Loading";
import {
  getAvatar,
  normilizeDate,
  normilizeDateWithHourAndMins,
  showNotification,
  showPopup,
} from "../utils/helpers";
import {
  avatarSizes,
  expressions,
  genders,
  notificationStatuses,
  notificationTimeouts,
  popupTexts,
  vkProfileSrc,
} from "../utils/consts";
import UserChecks from "../templates/UserChecks";
import vk_image from "../assets/img/vk.png";
import heart_svg from "../assets/svg/heart.svg";
import { Context } from "..";
import { ReactSVG } from "react-svg";
import userStore from "../store/userStore";
import userApi from "../http/userApi";
import { createNewAbortController } from "../utils/createNewAbortController";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { IUsers } from "../types/database";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<IUsers>({});
  const [isLoading, setIsLoading] = useState(true);

  const [isFriend, setIsFriend] = useState(false);
  const isMyProfile = userStore.data.id === +id;

  const abortControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    const fetchUserData = async () => {
      try {
        const response = await fetchWithAbort(
          (signal) => userApi.getUser(id, signal),
          signal
        );
        setUserData(response);
      } catch (err) {
        console.log(err);
      } finally {
        abortControllerRef.current = null;
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchFriendship = async () => {
      const { controller, signal } =
        createNewAbortController(abortControllerRef);
      abortControllerRef.current = controller;

      try {
        if (!isMyProfile) {
          const response = await fetchWithAbort(
            (signal) => userApi.getFriendship(id, signal),
            signal
          );
          setIsFriend(response.is_friends || response.is_request_sent);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    };
    fetchFriendship();
  }, [id, isMyProfile]);

  if (isLoading) {
    return <Loading />;
  }

  let {
    name,
    surname,
    vk_id,
    phones,
    avatar,
    role,
    birthday,
    is_banned,
    gender,
    rating,
    rating_count,
    is_verified_by_vk,
    is_verified_by_admin,
  } = userData;

  avatar = getAvatar(avatar, avatarSizes.biggest);
  birthday = normilizeDate(birthday);
  role = expressions[role];

  const toggleFriend = async () => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      let res = {};
      if (isFriend) {
        res = await fetchWithAbort(
          (signal) => userApi.deleteFriend(id, signal),
          signal
        );
        setIsFriend(false);
      } else {
        res = await fetchWithAbort(
          (signal) => userApi.addFriend(id, signal),
          signal
        );
        setIsFriend(true);
      }

      showNotification(res.message, notificationTimeouts.short);
    } catch (err) {
      console.error(err);
      showNotification(
        err.response.data.message,
        notificationTimeouts.normal,
        notificationStatuses.error
      );
    } finally {
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="container">
      <div className="profile-page">
        <div>
          <div className="profile-avatar">
            <img src={avatar} alt="Фото профиля" />
          </div>
          {!isMyProfile && (
            <div className="profile-buttons">
              <button
                type="button"
                className="invisible"
                onClick={() => toggleFriend()}
                onMouseEnter={(e) =>
                  showPopup(
                    e,
                    isFriend ? popupTexts.deleteFriend : popupTexts.addFriend
                  )
                }
              >
                <ReactSVG
                  src={heart_svg}
                  afterInjection={(svg) => {
                    svg.classList.add("heart");
                    svg.classList.toggle("friend", isFriend);
                  }}
                  onClick={(event) => {
                    if (isFriend) {
                      event.target.closest(".heart").classList.add("friend");
                    } else {
                      event.target.closest(".heart").classList.remove("friend");
                    }
                  }}
                />
              </button>
            </div>
          )}
          <div className="profile-contacts">
            <a
              className="link vk-link"
              href={vkProfileSrc + vk_id}
              target="_blank"
              rel="noopener noreferrer"
            >
              Вконтакте
            </a>
            {/* нужно доработать */}
            {phones && <span className="phone-number">{phones}</span>}
          </div>
        </div>
        <div className="profile-info">
          <div className="name">
            <span className="name-span">{name + " " + surname}</span>
            <UserChecks
              is_banned={is_banned}
              is_verified_by_admin={is_verified_by_admin}
              is_verified_by_vk={is_verified_by_vk}
            />
          </div>
          <div className="dashes">
            <span>{gender && genders[gender]}</span>
            <span>{birthday && birthday}</span>
            <span>{role}</span>
          </div>
          {rating_count && (
            <div className="dashes">
              <span>Рейтинг: {rating}</span>
              <span>{rating_count} оценок</span>
            </div>
          )}
          {!rating_count && <div>Нет оценок</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
