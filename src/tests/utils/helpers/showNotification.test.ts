import { screen, act } from "@testing-library/react";
import { showNotification } from "../../../utils/helpers";
import { notificationStatuses } from "../../../utils/consts";

// Создаём контейнер для уведомлений перед тестами
beforeEach(() => {
  document.body.innerHTML = '<div id="notification-container"></div>';
});

describe("showNotification", () => {
  it("рендерит уведомление в контейнере", () => {
    act(() => {
      showNotification("Hello, world!", null, notificationStatuses.success);
    });

    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
    expect(screen.getByText("x")).toBeInTheDocument();
  });

  it("уведомление закрывается при клике на 'x'", async () => {
    act(() => {
      showNotification("Close me", null, notificationStatuses.success);
    });

    const closeButton = screen.getByText("x");
    act(() => {
      closeButton.click();
    });

    expect(screen.queryByText("Close me")).not.toBeInTheDocument();
  });

  it("автоматически скрывает уведомление через timeout", async () => {
    jest.useFakeTimers();

    act(() => {
      showNotification("Auto-hide", 3000, notificationStatuses.success);
    });

    expect(screen.getByText("Auto-hide")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText("Auto-hide")).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
