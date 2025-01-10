import { makeAutoObservable } from "mobx";

class TripStore {
  constructor() {
    this._from = "";
    this._fromLat = "";
    this._fromLon = "";
    this._to = "";
    this._toLat = "";
    this._toLon = "";
    this._when = "";
    this._page = 1;
    this._totalCount = 0;
    this._limit = 10;
    this._price = [];
    makeAutoObservable(this, { autoBind: true });
  }

  setFrom(from) {
    this._from = from;
  }

  setFromLat(lat) {
    this._fromLat = lat;
  }

  setFromLon(lon) {
    this._fromLon = lon;
  }

  setTo(to) {
    this._to = to;
  }

  setToLat(lat) {
    this._toLat = lat;
  }

  setToLon(lon) {
    this._toLon = lon;
  }

  setWhen(when) {
    this._when = when;
  }

  setPage(page) {
    this._page = page;
  }

  setTotalCount(count) {
    this._totalCount = count;
  }

  setLimit(limit) {
    this._limit = limit;
  }

  setPrice(price) {
    this._price = price;
  }

  get from() {
    return this._from;
  }

  get fromLat() {
    return this._fromLat;
  }

  get fromLon() {
    return this._fromLon;
  }

  get to() {
    return this._to;
  }

  get toLat() {
    return this._toLat;
  }

  get toLon() {
    return this._toLon;
  }

  get when() {
    return this._when;
  }

  get page() {
    return this._page;
  }

  get totalCount() {
    return this._totalCount;
  }

  get limit() {
    return this._limit;
  }

  get price() {
    return this._price;
  }
}

const tripStore = new TripStore();
export default tripStore;
