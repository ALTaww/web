import { screen, fireEvent } from "@testing-library/react";
import { showPopup } from "../../../utils/helpers";

// Добавляем кнопку перед каждым тестом
beforeEach(() => {
  document.body.innerHTML =
    '<button data-testid="test-button">Hover me</button>';
});

describe("showPopup", () => {
  it("добавляет Popup в DOM", () => {
    const button = screen.getByTestId("test-button");

    button.addEventListener("mouseenter", (e) => showPopup(e, "some text"));
    fireEvent.mouseEnter(button); // Наводим мышь

    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

  it("удаляет Popup при mouseleave", () => {
    const button = screen.getByTestId("test-button");
    button.addEventListener("click", (e) => showPopup(e, "some text"));

    fireEvent.click(button);
    expect(screen.getByTestId("popup")).toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
  });

  it("Popup содержит правильный текст", () => {
    const button = screen.getByTestId("test-button");
    button.addEventListener("mouseover", (e) => showPopup(e, "some text"));

    fireEvent.mouseOver(button);
    expect(screen.getByTestId("popup")).toBeInTheDocument();
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
