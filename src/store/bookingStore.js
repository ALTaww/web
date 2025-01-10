import { makeAutoObservable } from "mobx";

class BookingStore {
  constructor() {
    this._passengersNumber = 0;
    this._maxPassengersNumber = 99;
    this._passengersData = [];
    this._passengersIds = [];
    this._errors = [];
    this._errorText = "";
    makeAutoObservable(this);
  }

  setMaxPassengersNumber(number) {
    this._maxPassengersNumber = number;
    return { success: true };
  }

  setErrorText(text) {
    this._errorText = text;
    return { success: true };
  }

  setErrors(errors) {
    this._errors = errors;
    return { success: true };
  }

  deleteError(value) {
    this._errors = this._errors.filter((error) => error !== value);
    return { success: true };
  }

  setPassengersIdsLength(length) {
    if (
      length === this.passengersIds.length ||
      length < 0 ||
      length > this.maxPassengersNumber
    ) {
      return;
    }
    if (length < this.passengersIds) {
      this._passengersIds.splice(length);
    } else if (length > this.passengersIds.length) {
      this._passengersIds.push(
        ...Array(length - this.passengersIds.length).fill(null)
      );
    }

    return { success: true };
  }

  _checkPassengersIds(id) {
    return this.passengersIds.includes(id);
  }

  setPassengersNumber(number) {
    number = +number;
    if (number <= 0 || number > this.maxPassengersNumber) return;
    this._passengersNumber = number;
    return { success: true };
  }

  addPassengerNumber() {
    if (this.passengersNumber < this.maxPassengersNumber) {
      this._passengersNumber++;
    }
    return { success: true };
  }

  deletePassengerNumber() {
    if (this.passengersNumber > 0) {
      this._passengersNumber--;
    }
    return { success: true };
  }

  setPassengersData(passengersData) {
    this._passengersData = passengersData;
    return { success: true };
  }

  addPassengerId(id) {
    id = +id;
    if (this.passengersIds.length >= this.maxPassengersNumber) {
      return;
    }
    if (this._checkPassengersIds(id)) {
      return;
    }
    this._passengersIds.push(id);
    return { success: true };
  }

  deletePassengerId(index) {
    this._passengersIds = [
      ...this._passengersIds.slice(0, index),
      ...this._passengersIds.slice(index + 1),
    ];
    return { success: true };
  }

  changePassengerId(index, newId) {
    newId = +newId;
    if (this.passengersIds.includes(newId)) {
      this.setErrorText("Нельзя дважды добавить одного пассажира");
      return { success: false };
    }
    this._passengersIds[index] = newId;
    return { success: true };
  }

  get passengersData() {
    return this._passengersData;
  }

  get passengersIds() {
    return this._passengersIds;
  }

  get passengersNumber() {
    return this._passengersNumber;
  }

  get maxPassengersNumber() {
    return this._maxPassengersNumber;
  }

  get errors() {
    return this._errors;
  }

  get errorText() {
    return this._errorText;
  }
}

const bookingStore = new BookingStore();
export default bookingStore;
