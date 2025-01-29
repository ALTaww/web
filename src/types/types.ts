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
