import React, {
  ChangeEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { friendsPages } from "../utils/consts";
import FriendsList from "../components/FriendsList";
import SearchInput from "../components/SearchInput";
import Loading from "../components/Loading";
import "./friends.css";
import { findFriends } from "../utils/helpers";
import userApi from "../http/userApi";
import { fetchWithAbort } from "../utils/fetchWithAbort";
import { createNewAbortController } from "../utils/createNewAbortController";
import { IFriendsPages } from "../types/types";
import { IUsers } from "../types/database";

const Friends = () => {
  const [friendsPage, setFriendsPage] = useState<IFriendsPages>(
    friendsPages.accepted
  );
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [sendedFriends, setSendedFriends] = useState([]);
  const [subs, setSubs] = useState([]);
  const [rejectedFriends, setRejectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAcceptedFriendsFetched, setIsAcceptedFriendsFetched] =
    useState(false);
  const [isSendedFriendsFetched, setIsSendedFriendsFetched] = useState(false);
  const [isSubsFetched, setIsSubsFetched] = useState(false);
  const [isRejectedFriendsFetched, setIsRejectedFriendsFetched] =
    useState(false);

  const [currentFriendsList, setCurrentFriendsList] = useState<IUsers[]>([]);

  const abortControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      try {
        if (!isAcceptedFriendsFetched) {
          const friends = await fetchWithAbort(
            (signal) => userApi.getAcceptedFriends(signal),
            signal
          ).then((res) => res.data);
          setAcceptedFriends(friends);
          setCurrentFriendsList(friends);
          setIsAcceptedFriendsFetched(true);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => controller.abort();
  }, []);

  async function setAcceptedActive() {
    setFriendsPage(friendsPages.accepted);
    setCurrentFriendsList(acceptedFriends);
    setSearchQuery("");
  }

  async function getSendedFriends() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      setFriendsPage(friendsPages.sended);
      setCurrentFriendsList(sendedFriends);
      setSearchQuery("");

      if (!isSendedFriendsFetched) {
        const friends = await fetchWithAbort(
          (signal) => userApi.getSendedRequests(signal),
          signal
        ).then((res) => res.data);
        setSendedFriends(friends);
        setIsSendedFriendsFetched(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getSubs() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      setFriendsPage(friendsPages.subs);
      setCurrentFriendsList(subs);
      setSearchQuery("");

      if (!isSubsFetched) {
        const subs = await fetchWithAbort(
          (signal) => userApi.getSubscribers(signal),
          signal
        ).then((res) => res.data);
        setSubs(subs);
        setIsSubsFetched(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      abortControllerRef.current = null;
    }
  }

  async function getRejectedFriends() {
    const { controller, signal } = createNewAbortController(abortControllerRef);
    abortControllerRef.current = controller;

    try {
      setFriendsPage(friendsPages.rejected);
      setCurrentFriendsList(rejectedFriends);
      setSearchQuery("");

      if (!isRejectedFriendsFetched) {
        const friends = await fetchWithAbort(
          (signal) => userApi.getRejectedRequests(signal),
          signal
        ).then((res) => res.data);
        setRejectedFriends(friends);
        setIsRejectedFriendsFetched(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function getCurrentFriendsList() {
    switch (friendsPage) {
      case friendsPages.accepted:
        return acceptedFriends;
      case friendsPages.sended:
        return sendedFriends;
      case friendsPages.subs:
        return subs;
      case friendsPages.rejected:
        return rejectedFriends;
      default:
        return [];
    }
  }

  function getCurrentFriendsListStatus() {
    switch (friendsPage) {
      case friendsPages.accepted:
        return true;
      case friendsPages.sended:
        return true;
      case friendsPages.subs:
        return false;
      case friendsPages.rejected:
        return false;
      default:
        return null;
    }
  }

  function searchFriends() {
    const friendsData = getCurrentFriendsList();
    const friends = findFriends(searchQuery, friendsData);
    setCurrentFriendsList(friends);
  }

  return (
    <div className="friends-page">
      <div className="search-friends">
        <SearchInput
          placeholder="Искать друзей"
          value={searchQuery}
          onChange={(e: ChangeEvent) => setSearchQuery(e.target.value)}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "Enter") {
              searchFriends();
            }
          }}
        />
        <button type="button" onClick={searchFriends}>
          Искать
        </button>
      </div>

      <div className="navigation">
        <div
          className={
            "accepted" +
            (friendsPage === friendsPages.accepted ? " active" : "")
          }
          onClick={setAcceptedActive}
        >
          Активные
        </div>
        <div
          className={
            "sended" + (friendsPage === friendsPages.sended ? " active" : "")
          }
          onClick={getSendedFriends}
        >
          Отправленные
        </div>
        <div
          className={
            "subscribers" + (friendsPage === friendsPages.subs ? " active" : "")
          }
          onClick={getSubs}
        >
          Подписчики
        </div>
        <div
          className={
            "rejected" +
            (friendsPage === friendsPages.rejected ? " active" : "")
          }
          onClick={getRejectedFriends}
        >
          Отказанные
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <FriendsList
          friends={currentFriendsList}
          is_friend={!!getCurrentFriendsListStatus()}
        />
      </Suspense>
    </div>
  );
};

export default Friends;
