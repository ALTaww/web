import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Добавлен импорт
import SettlementsSearchInput from "../../components/SettlementsSearchInput";
import { debouncedGetSettlements } from "../../utils/helpers";

// Мокаем функцию
jest.mock("../../utils/helpers", () => ({
  debouncedGetSettlements: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("SettlementsSearchInput", () => {
  const mockSaveData = jest.fn();

  it("рендерит инпут", () => {
    render(<SettlementsSearchInput saveData={mockSaveData} />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("отображает подсказки при вводе текста", async () => {
    (debouncedGetSettlements as jest.Mock).mockResolvedValue([
      { value: "New York", id: 1 },
      { value: "Los Angeles", id: 2 },
    ]);

    render(<SettlementsSearchInput saveData={mockSaveData} />);
    const input = screen.getByTestId("search-input");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "New" } });

    expect(await screen.findByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles")).toBeInTheDocument();
  });

  it("вызывает saveData при выборе подсказки", async () => {
    (debouncedGetSettlements as jest.Mock).mockResolvedValue([
      { value: "New York", id: 1 },
    ]);

    render(<SettlementsSearchInput saveData={mockSaveData} />);
    const input = screen.getByTestId("search-input");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "New" } });

    expect(await screen.findByText("New York")).toBeInTheDocument();

    fireEvent.click(screen.getByText("New York"));

    expect(mockSaveData).toHaveBeenCalledWith({ value: "New York", id: 1 });
    expect(input).toHaveValue("New York");
  });

  it("скрывает подсказки при потере фокуса", async () => {
    (debouncedGetSettlements as jest.Mock).mockResolvedValue([
      { value: "New York", id: 1 },
    ]);

    render(<SettlementsSearchInput saveData={mockSaveData} />);
    const input = screen.getByTestId("search-input");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "New" } });

    expect(await screen.findByText("New York")).toBeInTheDocument();

    fireEvent.blur(input);

    await waitFor(() =>
      expect(screen.queryByText("New York")).not.toBeInTheDocument()
    );
  });

  it("не отображает подсказки, если `nosuggestions = true`", async () => {
    render(<SettlementsSearchInput saveData={mockSaveData} nosuggestions />);
    const input = screen.getByTestId("search-input");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "New" } });

    await waitFor(() => {
      expect(screen.queryByText("New York")).not.toBeInTheDocument();
    });
  });

  it("отображает 'Нет совпадений', если нет результатов", async () => {
    (debouncedGetSettlements as jest.Mock).mockResolvedValue([]);

    render(<SettlementsSearchInput saveData={mockSaveData} />);
    const input = screen.getByTestId("search-input");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "xgagagagagfdga" } });

    expect(await screen.findByText("Нет совпадений")).toBeInTheDocument();
  });
});
