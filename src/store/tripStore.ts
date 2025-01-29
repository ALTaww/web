import { makeAutoObservable } from "mobx";

class TripStore {
  from = "";
  fromLat: string | number = "";
  fromLon: string | number = "";
  to = "";
  toLat: string | number = "";
  toLon: string | number = "";
  when = "";
  page = 1;
  totalCount = 0;
  limit = 10;
  price = [];

  constructor() {
    makeAutoObservable(this);
  }

  setFrom(from: string) {
    this.from = from;
  }

  setFromLat(lat: string | number) {
    this.fromLat = lat;
  }

  setFromLon(lon: string | number) {
    this.fromLon = lon;
  }

  setTo(to: string) {
    this.to = to;
  }

  setToLat(lat: string | number) {
    this.toLat = lat;
  }

  setToLon(lon: string | number) {
    this.toLon = lon;
  }

  setWhen(when: string) {
    this.when = when;
  }

  setPage(page: number) {
    this.page = page;
  }

  setTotalCount(count: number) {
    this.totalCount = count;
  }

  setLimit(limit: number) {
    this.limit = limit;
  }

  setPrice(price: []) {
    this.price = price;
  }
}

const tripStore = new TripStore();
export default tripStore;
