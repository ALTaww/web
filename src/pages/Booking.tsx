import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link, redirect, useParams } from "react-router-dom";
import { paths } from "./paths";
import Trip from "../components/Trip";

import Loading from "../components/Loading";
import NotFound from "./NotFound";
import {
  debounce,
  getFullName,
  normilizeDateWithHourAndMins,
  showNotification,
  toggleActive,
} from "../utils/helpers";
import { notificationStatuses, notificationTimeouts } from "../utils/consts";
import FriendsInput from "../components/FriendsInput";
import { observer } from "mobx-react";
import { autorun } from "mobx";
import bookingStore from "../store/bookingStore";
import userStore from "../store/userStore";
import tripApi from "../http/tripApi";
import userApi from "../http/userApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { createNewAbortController } from "../utils/createNewAbortController";
import Button from "../templates/Buttons/Button";
import { ITrips } from "../types/database";

const Booking = () => {
  const { id } = useParams();
  const [tripInfo, setTripInfo] = useState<ITrips>({});
  const [driverInfo, setDriverInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const debounceFunc = debounce(findFriends, 1000);
  let debounceTimer = null;

  const [isAcceptedFriendsFetched, setIsAcceptedFriendsFetched] =
    useState(false);

  const abortControllerRef = useRef<AbortController>(null);

  // Запрос друзей (1 раз при изменении кол-ва пассажиров)
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      if (!isAcceptedFriendsFetched && bookingStore.passengersNumber > 1) {
        const acceptedFriends = await fetchWithAbort(
          (signal) => userApi.getAcceptedFriends(signal),
          signal
        ).then((res) => res.data);
        console.log("acceptedFriends: ", acceptedFriends);
        bookingStore.setPassengersData(acceptedFriends);
        setIsAcceptedFriendsFetched(true);
      }
    })();

    return () => controller.abort();
  }, [bookingStore.passengersNumber]);

  // Запрос данных поездки и водителя
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!id) {
      return <h2>Что-то пошло не так, отсутсвует id поезки</h2>;
    }
    (async () => {
      try {
        const trip = await fetchWithAbort(
          (signal) => tripApi.getTrip(id, signal),
          signal
        );
        setTripInfo(trip);

        if (
          trip.occupied_seats !== trip.seats &&
          !bookingStore.passengersIds.length > 0
        ) {
          bookingStore.addPassengerId(userStore.data.id);
          bookingStore.addPassengerNumber();
          bookingStore.setMaxPassengersNumber(trip.seats - trip.occupied_seats);
        }

        const driver = await fetchWithAbort(
          (signal) => userApi.getUser(trip.driver_id, signal),
          signal
        );
        setDriverInfo(driver);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (bookingStore.errorText) {
      showNotification(
        bookingStore.errorText,
        notificationTimeouts.short,
        notificationStatuses.error
      );
      bookingStore.setErrorText("");
    }
  }, [bookingStore.errorText]);

  useEffect(() => {
    //bookingStore.errors.forEach();
  }, [bookingStore.errors]);

  //

  if (isLoading) {
    return <Loading />;
  }

  if (!tripInfo.id) {
    return <NotFound />;
  }
  const bookSeat = async (event) => {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      event.preventDefault();
      // Запрос на сервер с уменьшением места и добавлением пассажиров
      console.log(bookingStore.passengersIds, bookingStore.passengersNumber);
      if (
        bookingStore.passengersIds.length !== bookingStore.passengersNumber ||
        bookingStore.passengersIds.includes(null)
      ) {
        showNotification(
          `Количество мест должно совпадать с количеством выбранных пассажиров`,
          notificationTimeouts.short,
          notificationStatuses.error
        );
        return;
      }
      if (
        bookingStore.passengersIds.length <
        new Set(bookingStore.passengersIds).size
      ) {
        showNotification(
          "Все пассажиры должны быть уникальны",
          notificationTimeouts.short,
          notificationStatuses.error
        );
      }

      const trip = await fetchWithAbort(
        (signal) => tripApi.bookTrip(id, bookingStore.passengersIds, signal),
        signal
      );
      console.log(trip);

      showNotification(
        <p>
          Вы забронировали ${bookingStore.passengersNumber} мест для поездки
          {tripInfo.from_location + "-" + tripInfo.to_location}.<br />
          Время: ${normilizeDateWithHourAndMins(tripInfo.when_time)}
        </p>,
        null,
        notificationStatuses.success
      );
    } catch (err) {
      let errData = err.response.data;
      console.log(errData);

      showNotification(
        errData.message ||
          "При бронировании произошла ошибка. Пожалуйста, попробуйте позже либо напишите администратору",
        notificationTimeouts.normal,
        notificationStatuses.error
      );
      if (errData.errors.length) {
        bookingStore.setErrors(errData.errors);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  async function findFriends(search: string) {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      if (search) {
        const users = await fetchWithAbort(
          (signal) =>
            userApi
              .getAcceptedFriendsByNameAndSurname(search, signal)
              .then((res) => res.data),
          signal
        );
        console.log(users);
      }
    } catch (err) {
      console.log(err);
    }
  }

  let freeSeats = tripInfo.seats - tripInfo.occupied_seats;

  return (
    <>
      <Trip {...tripInfo} {...driverInfo} isBooking={true} />
      <div className="modal active-handler">
        <h3>Бронирование</h3>

        {!userStore.isAuth && (
          <div>
            <p>
              Для того чтобы забронировать место нужно быть зарегистрированным
            </p>
            <Link to={paths.Login}>Войти</Link>
          </div>
        )}
        {freeSeats === 0 && (
          <div>
            <p>
              К сожалению все места для этой поездки уже заняты, попробуйте
              поискать другую поездку или создайте свой запрос{" "}
            </p>
          </div>
        )}
        {userStore.isAuth && (
          <>
            <form>
              <div>
                <label htmlFor="passengers-number">Количество мест</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={freeSeats}
                  id="passengers-number"
                  name="passengers-number"
                  value={bookingStore.passengersNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = parseInt(e.target.value, 10);
                    if (!inputValue) {
                      e.target.value = bookingStore.passengersNumber;
                    }
                    if (inputValue < 1 || inputValue > freeSeats) {
                      showNotification(
                        `Нельзя добавить больше мест чем свободно`,
                        notificationTimeouts.short,
                        notificationStatuses.classic
                      );
                      e.target.value = bookingStore.passengersNumber;
                    } else {
                      bookingStore.setPassengersNumber(inputValue);
                      bookingStore.setPassengersIdsLength(inputValue);
                      console.log(bookingStore.passengersNumber);
                    }
                  }}
                />
              </div>
              <div className="user-input">
                <input
                  type="search"
                  value={getFullName(
                    userStore.data.name,
                    userStore.data.surname
                  )}
                  disabled
                />
                <Button
                  type="button"
                  onClick={() => bookingStore.addPassengerNumber()}
                >
                  Добавить человека
                </Button>
              </div>
              {isAcceptedFriendsFetched &&
                Array.from({ length: bookingStore.passengersNumber - 1 })
                  .fill(0)
                  .map((pass, i) => (
                    <React.Fragment key={i}>
                      <FriendsInput required={true} />
                      <Button
                        type="button"
                        onClick={() => {
                          bookingStore.deletePassengerNumber();
                          bookingStore.deletePassengerId(i + 1);
                        }}
                      >
                        Удалить
                      </Button>
                    </React.Fragment>
                  ))}
              <div>
                <Button type="submit" onClick={bookSeat}>
                  Забронировать
                </Button>
              </div>
            </form>
            <div className="attention notes">
              <p>Добавить можно только активного друга.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default observer(Booking);
