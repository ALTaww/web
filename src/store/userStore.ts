import { makeAutoObservable } from "mobx";
import { IUser } from "../types/database";

class UserStore {
  isAuth = false;
  data: IUser = {
    id: 0,
    vk_id: 0,
    role: "PASSENGER",
    name: "",
    surname: "",
    phones: null,
    private_phones: null,
    avatar: "",
    gender: null,
    birthday: null,
    rating: "",
    rating_count: 0,
    is_banned: null,
    is_verified_by_vk: false,
    is_verified_by_admin: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth(bool: boolean) {
    this.isAuth = bool;
  }
  setData(data: {}) {
    this.data = data;
  }
}

const userStore = new UserStore();
export default userStore;
