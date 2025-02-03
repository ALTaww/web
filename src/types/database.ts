import { IUserGenders, IUserRoles } from "./types";

export interface IUsers {
  id: number;
  vk_id: number;
  role: IUserRoles;
  name: string;
  surname: string;
  phones: string | null;
  private_phones: string | null;
  avatar: string;
  gender: IUserGenders;
  birthday: Date | null;
  rating: string; // float
  rating_count: number;
  is_banned: boolean | null;
  is_verified_by_vk: boolean;
  is_verified_by_admin: boolean;
}

export interface ITrips {
  id: number;
  driver_id: number;
  from_location: string;
  to_location: string;
  when_time: string;
  price: number;
  seats: number;
  occupied_seats: number;
}

export interface IReviews {
  id: number;
  user_id: number;
  driver_id: number;
  rate: number; // 1-5
  text: string;
}

export interface IBookedTrips {
  id: number;
  user_id: number;
  trip_id: number;
  time_booked: Date;
  booker_id: number;
}

export interface IFriends {
  user_id: number;
  friend_id: number;
  request_accepted: boolean;
}
