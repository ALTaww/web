import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "../../templates/Notification";
import { notificationStatuses } from "../../utils/consts";

describe("Notification", () => {
  const mockOnClose = jest.fn();

  it("рендерит уведомление с текстовым сообщением", () => {
    render(
      <Notification
        message="Test message"
        status={notificationStatuses.success}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByTestId("notification")).toHaveClass(
      `notification ${notificationStatuses.success}`
    );
  });

  it("рендерит уведомление с React элементом", () => {
    render(
      <Notification
        message={<strong>Important</strong>}
        status={notificationStatuses.error}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByTestId("notification")).toHaveClass(
      `notification ${notificationStatuses.error}`
    );
  });

  it("вызывает onClose при клике на кнопку закрытия", () => {
    render(
      <Notification
        message="Close test"
        status={notificationStatuses.success}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("x"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
