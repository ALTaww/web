import React, { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput";
import {
  getAllUserInfo,
  getReviewById,
  getTripById,
} from "../../http/adminApi";
import { pageNames } from "../pageNames";
import AdminInfoPanel from "../../components/admin/AdminInfoPanel";

const Admin = () => {
  const [userInputValue, setUserInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [userFriendsInfo, setUserFriendsInfo] = useState({});
  const [userTripsInfo, setUserTripsInfo] = useState({});
  const [userReviewsInfo, setUserReviewsInfo] = useState({});
  const [userBookedTripsInfo, setUserBookedTripsInfo] = useState({});

  const [tripInputValue, setTripInputValue] = useState("");
  const [tripInfo, setTripInfo] = useState({});

  const [reviewInputValue, setReviewInputValue] = useState("");
  const [reviewInfo, setReviewInfo] = useState({});

  async function getUserInfo() {
    if (!userInputValue) return;
    let commonUserInfo = {};
    let friends = {};
    let trips = {};
    let reviews = {};
    let bookedTrips = {};
    try {
      if (typeof +userInputValue === "number") {
        commonUserInfo = await getAllUserInfo(userInputValue);
        setUserInfo(commonUserInfo);
        console.log(commonUserInfo);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getTripInfo() {
    try {
      if (typeof +tripInputValue === "number") {
        const response = await getTripById(+tripInputValue);
        console.log(response);
        setTripInfo(response);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getReviewInfo() {
    try {
      if (typeof +reviewInputValue === "number") {
        const response = await getReviewById(+reviewInputValue);
        console.log(response);
        setReviewInfo(response);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    document.title = pageNames.Admin;
  });
  return (
    <div id="admin-page">
      <div>
        <h3>Пользователи</h3>
        <SearchInput
          placeholder="Имя и фамилия или ID пользователя"
          value={userInputValue}
          onChange={(e) => setUserInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getUserInfo();
            }
          }}
        />
        <button type="button" onClick={getUserInfo}>
          Искать
        </button>
      </div>
      {userInfo.length > 0 && <AdminInfoPanel props={userInfo.userInfo} />}
      <div>
        <h3>Поездки</h3>
        <SearchInput
          placeholder="ID поездки"
          value={tripInputValue}
          onChange={(e) => setTripInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getTripInfo();
            }
          }}
        />
        <button type="button" onClick={getTripInfo}>
          Искать
        </button>
      </div>
      {tripInfo.id && <AdminInfoPanel {...tripInfo} />}
      <div>
        <h3>Отзывы</h3>
        <SearchInput
          placeholder="ID отзыва"
          value={reviewInputValue}
          onChange={(e) => setReviewInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getReviewInfo();
            }
          }}
        />
        <button type="button" onClick={getReviewInfo}>
          Искать
        </button>
      </div>
      {reviewInfo.id && <AdminInfoPanel {...reviewInfo} />}
    </div>
  );
};

export default Admin;
