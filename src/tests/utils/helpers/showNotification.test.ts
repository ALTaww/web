import { showNotification } from "../../../utils/helpers";

describe("showNotification", () => {
  // Notification renders successfully with default success status and message
  it("should render notification with default success status and message", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    showNotification(message);

    expect(container.querySelector(".notification")).toBeInTheDocument();
    expect(container.textContent).toContain(message);
    expect(container.querySelector(".success")).toBeInTheDocument();
  });

  // Notification container exists and notification gets appended
  it("should append notification to existing container", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const createRootMock = jest.spyOn(ReactDOM, "createRoot");
    showNotification("Test");

    expect(createRootMock).toHaveBeenCalled();
    expect(container.children.length).toBe(1);
  });

  // Notification container does not exist in DOM
  it("should not render when container is missing", () => {
    const createRootMock = jest.spyOn(ReactDOM, "createRoot");
    showNotification("Test");

    expect(createRootMock).not.toHaveBeenCalled();
    expect(document.querySelector("#notification-container")).toBeNull();
  });

  // Multiple notifications rendered simultaneously
  it("should render multiple notifications simultaneously", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    showNotification("First");
    showNotification("Second");
    showNotification("Third");

    expect(container.children.length).toBe(3);
  });

  // Very short timeout values (< 2000ms)
  it("should handle short timeout values correctly", () => {
    jest.useFakeTimers();
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    showNotification("Test", 1500);

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);

    jest.runAllTimers();
    expect(container.children.length).toBe(0);
  });

  // Notification closes properly when onClose is triggered
  it("should remove notification from DOM when onClose is called", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    const timeout = 3000;
    showNotification(message, timeout);

    jest.advanceTimersByTime(timeout);

    expect(container.querySelector(".notification")).not.toBeInTheDocument();
  });

  // Timeout triggers fade class addition and removal at correct intervals
  it("should add fade class and remove notification after timeout", () => {
    jest.useFakeTimers();
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    const timeout = 3000;
    showNotification(message, timeout);

    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();

    jest.advanceTimersByTime(timeout - 2000);
    expect(div.classList.contains("fade")).toBe(true);

    jest.advanceTimersByTime(2000);
    expect(container.querySelector("div")).toBeNull();

    jest.useRealTimers();
  });

  // Message renders correctly for both string and HTMLElement types
  it("should render notification with string and HTMLElement messages", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const stringMessage = "String message";
    showNotification(stringMessage);
    expect(container.querySelector(".notification")).toBeInTheDocument();
    expect(container.textContent).toContain(stringMessage);

    const htmlElementMessage = document.createElement("span");
    htmlElementMessage.textContent = "HTMLElement message";
    showNotification(htmlElementMessage);
    expect(container.querySelector(".notification")).toBeInTheDocument();
    expect(container.textContent).toContain("HTMLElement message");
  });

  // Component unmounts cleanly without memory leaks
  it("should unmount notification and remove element from DOM when closed", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    showNotification(message, null);

    const notificationDiv = container.querySelector("div");
    expect(notificationDiv).toBeInTheDocument();

    // Simulate onClose
    const onClose = jest.fn();
    notificationDiv.querySelector(".close-button").click();

    expect(onClose).toHaveBeenCalled();
    expect(notificationDiv).not.toBeInTheDocument();
  });

  // Dynamic updates to message content after render
  it("should update notification message dynamically after render", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const initialMessage = "Initial message";
    const updatedMessage = "Updated message";
    showNotification(initialMessage);

    const notificationElement = container.querySelector(".notification");
    expect(notificationElement).toBeInTheDocument();
    expect(container.textContent).toContain(initialMessage);

    // Simulate dynamic update
    showNotification(updatedMessage);

    expect(container.textContent).toContain(updatedMessage);
  });

  // Fade animation completes before removal
  it("should apply fade class before removing notification when timeout is set", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    const timeout = 3000;
    showNotification(message, timeout);

    jest.advanceTimersByTime(timeout - 2000);
    expect(container.querySelector(".fade")).toBeInTheDocument();

    jest.advanceTimersByTime(2000);
    expect(container.querySelector(".notification")).not.toBeInTheDocument();
  });

  // Empty message passed
  it("should not render notification when message is empty", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "";
    showNotification(message);

    expect(container.querySelector(".notification")).not.toBeInTheDocument();
  });

  // Invalid status value provided
  it("should not render notification when invalid status is provided", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    const invalidStatus = "invalid_status";

    showNotification(message, null, invalidStatus);

    expect(container.querySelector(".notification")).not.toBeInTheDocument();
  });

  // ReactDOM root creation and cleanup happens properly
  it("should create and cleanup ReactDOM root properly when notification is shown", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message = "Test message";
    const timeout = 3000;

    showNotification(message, timeout);

    const div = container.querySelector("div");
    expect(div).not.toBeNull();
    expect(container.querySelector(".notification")).toBeInTheDocument();

    jest.advanceTimersByTime(timeout);

    expect(container.querySelector(".notification")).not.toBeInTheDocument();
    expect(container.querySelector("div")).toBeNull();
  });

  // Notification stacking/positioning in container
  it("should stack notifications correctly in the container", () => {
    const container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);

    const message1 = "First notification";
    const message2 = "Second notification";

    showNotification(message1);
    showNotification(message2);

    const notifications = container.querySelectorAll(".notification");
    expect(notifications.length).toBe(2);
    expect(notifications[0].textContent).toContain(message1);
    expect(notifications[1].textContent).toContain(message2);
  });
});
