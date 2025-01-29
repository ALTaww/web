import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../../components/SearchInput";
import adminApi from "../../http/adminApi";
import { pageNames } from "../pageNames";
import AdminInfoPanel from "../../components/admin/AdminInfoPanel";
import { createNewAbortController } from "../../utils/createNewAbortController";
import { fetchWithAbort } from "../../utils/fetchWithAbort";

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

  const abortControllerRef = useRef(null);

  async function getUserInfo() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    if (!userInputValue) return;
    let commonUserInfo = {};
    let friends = {};
    let trips = {};
    let reviews = {};
    let bookedTrips = {};
    try {
      if (typeof +userInputValue === "number") {
        commonUserInfo = await fetchWithAbort(
          (signal) => adminApi.getAllUserInfo(userInputValue, signal),
          signal
        );
        setUserInfo(commonUserInfo);
        console.log(commonUserInfo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      abortControllerRef.current = null;
    }
  }

  async function getTripInfo() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      if (typeof +tripInputValue === "number") {
        const response = await fetchWithAbort(
          (signal) => adminApi.getTripById(+tripInputValue, signal),
          signal
        );
        console.log(response);
        setTripInfo(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      abortControllerRef.current = null;
    }
  }

  async function getReviewInfo() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      if (typeof +reviewInputValue === "number") {
        const response = await fetchWithAbort(
          (signal) => adminApi.getReviewById(+reviewInputValue, signal),
          signal
        );
        console.log(response);
        setReviewInfo(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      abortControllerRef.current = null;
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
