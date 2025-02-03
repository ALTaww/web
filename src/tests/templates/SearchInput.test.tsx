import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "../../templates/SearchInput"; // Путь к компоненту
import "@testing-library/jest-dom";

describe("SearchInput Component", () => {
  test("Рендерится без ошибок", () => {
    render(<SearchInput />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  test("Принимает и применяет className и placeholder", () => {
    render(
      <SearchInput className="custom-class" placeholder="Введите текст" />
    );

    const input = screen.getByPlaceholderText("Введите текст");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("custom-class search-input"); // Проверяем классы
  });

  test("Изменение ввода изменяет `value`", () => {
    render(<SearchInput />);
    const input = screen.getByRole("searchbox");
    if (!(input instanceof HTMLInputElement))
      throw new Error("Тип элемента SearchInput не HTMLInputElement");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  test("Вызывает `onChange`, если передан", () => {
    const handleChange = jest.fn();
    render(<SearchInput onChange={handleChange} />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Test" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
