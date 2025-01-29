import { makeAutoObservable } from "mobx";

class BookingStore {
  passengersNumber = 0;
  maxPassengersNumber = 99;
  passengersData = [];
  passengersIds: number[] = [];
  errors: string[] = [];
  errorText = "";

  constructor() {
    makeAutoObservable(this);
  }

  setMaxPassengersNumber(number: number) {
    this.maxPassengersNumber = number;
    return { success: true };
  }

  setErrorText(text: string) {
    this.errorText = text;
    return { success: true };
  }

  setErrors(errors: string[]) {
    this.errors = errors;
    return { success: true };
  }

  deleteError(value) {
    this.errors = this.errors.filter((error) => error !== value);
    return { success: true };
  }

  setPassengersIdsLength(length: number) {
    if (
      length === this.passengersIds.length ||
      length < 0 ||
      length > this.maxPassengersNumber
    ) {
      return;
    }
    if (length < this.passengersIds.length) {
      this.passengersIds.splice(length);
    } else if (length > this.passengersIds.length) {
      this.passengersIds.push(
        ...Array(length - this.passengersIds.length).fill(null)
      );
    }

    return { success: true };
  }

  checkPassengersIds(id: number) {
    return this.passengersIds.includes(id);
  }

  setPassengersNumber(number: number) {
    number = +number;
    if (number <= 0 || number > this.maxPassengersNumber) return;
    this.passengersNumber = number;
    return { success: true };
  }

  addPassengerNumber() {
    if (this.passengersNumber < this.maxPassengersNumber) {
      this.passengersNumber++;
    }
    return { success: true };
  }

  deletePassengerNumber() {
    if (this.passengersNumber > 0) {
      this.passengersNumber--;
    }
    return { success: true };
  }

  setPassengersData(passengersData: []) {
    this.passengersData = passengersData;
    return { success: true };
  }

  addPassengerId(id: number) {
    id = +id;
    if (this.passengersIds.length >= this.maxPassengersNumber) {
      return;
    }
    if (this.checkPassengersIds(id)) {
      return;
    }
    this.passengersIds.push(id);
    return { success: true };
  }

  deletePassengerId(index: number) {
    this.passengersIds = [
      ...this.passengersIds.slice(0, index),
      ...this.passengersIds.slice(index + 1),
    ];
    return { success: true };
  }

  changePassengerId(index: number, newId: number) {
    newId = +newId;
    if (this.passengersIds.includes(newId)) {
      this.setErrorText("Нельзя дважды добавить одного пассажира");
      return { success: false };
    }
    this.passengersIds[index] = newId;
    return { success: true };
  }
}

const bookingStore = new BookingStore();
export default bookingStore;
