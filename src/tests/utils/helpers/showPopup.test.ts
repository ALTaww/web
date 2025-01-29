import { showPopup } from "../../../utils/helpers";

describe("showPopup", () => {
  // Popup renders correctly with text string input at calculated position
  it("should render popup with text at calculated position", () => {
    const mockEvent = {
      target: {
        offsetLeft: 100,
        offsetWidth: 50,
        offsetTop: 200,
        addEventListener: jest.fn(),
      },
    };
    const text = "Test popup";

    const mockContainer = document.createElement("div");
    const mockRoot = { render: jest.fn(), unmount: jest.fn() };

    jest.spyOn(document, "createElement").mockReturnValue(mockContainer);
    jest.spyOn(document.body, "appendChild");
    jest.spyOn(ReactDOM, "createRoot").mockReturnValue(mockRoot);

    showPopup(mockEvent, text);

    expect(document.createElement).toHaveBeenCalledWith("div");
    expect(document.body.appendChild).toHaveBeenCalledWith(mockContainer);
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(mockContainer);
    expect(mockRoot.render).toHaveBeenCalledWith(expect.any(Object));
  });

  // Popup renders correctly with HTMLElement input at calculated position
  it("should render popup with HTMLElement at calculated position", () => {
    const mockEvent = {
      target: {
        offsetLeft: 100,
        offsetWidth: 50,
        offsetTop: 200,
        addEventListener: jest.fn(),
      },
    };
    const htmlElement = document.createElement("div");
    htmlElement.textContent = "HTML Content";

    const mockContainer = document.createElement("div");
    const mockRoot = { render: jest.fn(), unmount: jest.fn() };

    jest.spyOn(document, "createElement").mockReturnValue(mockContainer);
    jest.spyOn(ReactDOM, "createRoot").mockReturnValue(mockRoot);

    showPopup(mockEvent, htmlElement);

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(mockContainer);
    expect(mockRoot.render).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          text: htmlElement,
        }),
      })
    );
  });

  // Handle null/undefined event target
  it("should handle null event target gracefully", () => {
    const mockEvent = { target: null };
    const text = "Test popup";

    expect(() => showPopup(mockEvent, text)).not.toThrow();

    expect(document.createElement).not.toHaveBeenCalled();
    expect(ReactDOM.createRoot).not.toHaveBeenCalled();
  });

  // Handle event target without offset properties
  it("should handle missing offset properties", () => {
    const mockEvent = {
      target: {
        addEventListener: jest.fn(),
      },
    };
    const text = "Test popup";

    const mockContainer = document.createElement("div");
    const mockRoot = { render: jest.fn(), unmount: jest.fn() };

    jest.spyOn(document, "createElement").mockReturnValue(mockContainer);
    jest.spyOn(ReactDOM, "createRoot").mockReturnValue(mockRoot);

    showPopup(mockEvent, text);

    expect(mockRoot.render).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          x_center: NaN,
          y: undefined,
        }),
      })
    );
  });

  // Handle empty string text input
  it("should render popup with empty string", () => {
    const mockEvent = {
      target: {
        offsetLeft: 100,
        offsetWidth: 50,
        offsetTop: 200,
        addEventListener: jest.fn(),
      },
    };

    const mockContainer = document.createElement("div");
    const mockRoot = { render: jest.fn(), unmount: jest.fn() };

    jest.spyOn(document, "createElement").mockReturnValue(mockContainer);
    jest.spyOn(ReactDOM, "createRoot").mockReturnValue(mockRoot);

    showPopup(mockEvent, "");

    expect(mockRoot.render).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          text: "",
        }),
      })
    );
  });
});
