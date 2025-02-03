export type INotificationStatuses = "success" | "error" | "classic";

export interface IGeoPlaceData {
  geo_lat: number;
  geo_lon: number;
  fias_level: string;
  country: string;
  region: string;
  area: string;
  city: string;
  city_type: string;
  postal_code: string;
  region_type: string;
  settlement_type: string;
  // and many others...
}

export interface ISuggestions {
  value: string;
  data: IGeoPlaceData;
}

export interface IDirectionsGetRoute {
  polyline: string;
  time: number;
  distance: number;
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
  codeVerifier: string;
  config: {
    app: string;
    codeChallenge: string;
    redirectUrl: string;
    state: string;
  };
}

export type IUserRoles = "PASSENGER" | "DRIVER" | "ADMIN";
export type IUserGenders = "male" | "female" | null;

export interface IFriendship {
  is_friends: boolean;
  is_request_sent: boolean;
  is_request_received: boolean;
}

export interface IMessageResponse {
  message: string;
}
