export type INotificationStatuses = "success" | "error" | "classic";

export interface IGeoPlaceData {
  geo_lat: number;
  geo_lon: number;
  fias_level: string;
}

export interface ISuggestions {
  value: string;
  data: IGeoPlaceData;
}

export type IFriendsPages = "accepted" | "sended" | "subs" | "rejected";

export type ISettlementsTypes = "город" | "деревня" | "селение" | "пригород";

export interface ISettlements {
  name: string;
  lon: number;
  lat: number;
  type: ISettlementsTypes;
}

export interface IVkConfig {
  code: string;
  state: string;
  device_id: string;
  code_verifier: string;
}

export type IUserRoles = "PASSENGER" | "DRIVER" | "ADMIN";
export type IUserGenders = "male" | "female" | null;
