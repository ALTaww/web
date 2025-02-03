import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import TripSearch from "../../components/TripSearch";
import tripStore from "../../store/tripStore";
import { showNotification } from "../../utils/helpers";

// Мокаем useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Мокаем showNotification
jest.mock("../../utils/helpers", () => ({
  ...jest.requireActual("../../utils/helpers"),
  showNotification: jest.fn(),
}));

describe("TripSearch", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Сбрасываем состояние MobX-store
    tripStore.setFrom("");
    tripStore.setFromLat("");
    tripStore.setFromLon("");
    tripStore.setTo("");
    tripStore.setToLat("");
    tripStore.setToLon("");
    tripStore.setWhen("");
  });

  it("рендерит компонент", () => {
    render(<TripSearch />);
    expect(screen.getByText("Город / населенный пункт:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Откуда")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Куда")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Когда")).toBeInTheDocument();
    expect(screen.getByText("Найти")).toBeInTheDocument();
  });

  it("позволяет вводить данные в поля", () => {
    render(<TripSearch />);
    const fromInput = screen.getByPlaceholderText("Откуда") as HTMLInputElement;
    const toInput = screen.getByPlaceholderText("Куда") as HTMLInputElement;
    const dateInput = screen.getByPlaceholderText("Когда") as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: "Москва" } });
    fireEvent.change(toInput, { target: { value: "Санкт-Петербург" } });
    fireEvent.change(dateInput, { target: { value: "2025-02-10" } });

    expect(fromInput.value).toBe("Москва");
    expect(toInput.value).toBe("Санкт-Петербург");
    expect(dateInput.value).toBe("2025-02-10");
  });

  it("выполняет навигацию при корректных данных", () => {
    tripStore.setFrom("Москва");
    tripStore.setFromLat(55.7558);
    tripStore.setFromLon(37.6173);
    tripStore.setTo("Санкт-Петербург");
    tripStore.setToLat(59.9343);
    tripStore.setToLon(30.3351);
    tripStore.setWhen("2025-02-10");

    render(<TripSearch />);
    const searchButton = screen.getByText("Найти");

    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/searchresults?from=Москва&to=Санкт-Петербург&when=2025-02-10"
    );
  });

  it("показывает уведомление при некорректных данных", () => {
    tripStore.setFrom("");
    tripStore.setFromLat("");
    tripStore.setFromLon("");
    tripStore.setTo("");
    tripStore.setToLat("");
    tripStore.setToLon("");
    tripStore.setWhen("");

    render(<TripSearch />);
    const searchButton = screen.getByText("Найти");

    fireEvent.click(searchButton);

    expect(showNotification).toHaveBeenCalledWith(
      "Пожалуйста выберите один из предложенных населенных пунктов в списках, а также желаемую дату",
      expect.any(Number),
      expect.any(String)
    );
  });
});
