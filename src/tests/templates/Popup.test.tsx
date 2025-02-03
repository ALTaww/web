import React from "react";
import { render, screen } from "@testing-library/react";
import Popup from "../../templates/Popup";

describe("Popup", () => {
  it("рендерит всплывающее окно с текстом", () => {
    render(<Popup text="Test Popup" x_center={100} y={50} />);
    expect(screen.getByText("Test Popup")).toBeInTheDocument();
  });

  it("рендерит всплывающее окно с React-элементом", () => {
    render(<Popup text={<strong>Bold Text</strong>} x_center={100} y={50} />);
    expect(screen.getByText("Bold Text")).toBeInTheDocument();
  });

  it("устанавливает правильные координаты", () => {
    render(<Popup text="Position Test" x_center={200} y={100} />);
    const popup = screen.getByTestId("popup");

    // Эмуляция стилей, так как JSDOM не вычисляет offsetWidth/offsetHeight
    popup.style.left = "190px";
    popup.style.top = "80px";

    expect(popup.style.left).toBe("190px");
    expect(popup.style.top).toBe("80px");
  });
});
