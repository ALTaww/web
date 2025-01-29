import {
  debounce,
  findFriends,
  getAvatar,
  getFullName,
  getGrammaticalEnding,
  isDate,
  normilizeDate,
  normilizeDateWithHourAndMins,
  toggleActive,
} from "../../../utils/helpers";

describe("isDate", () => {
  // Valid date string in ISO format returns true
  it("should return true when given valid ISO date string", () => {
    const isoDateString = "2023-12-25T10:30:00.000Z";
    const result = isDate(isoDateString);
    expect(result).toBe(true);
  });

  // Valid date string in local format returns true
  it("should return true when given valid local date string", () => {
    const localDateString = "12/25/2023";
    const result = isDate(localDateString);
    expect(result).toBe(true);
  });

  // Empty string returns false
  it("should return false when given empty string", () => {
    const emptyString = "";
    const result = isDate(emptyString);
    expect(result).toBe(false);
  });

  // Invalid date string returns false
  it("should return false when given invalid date string", () => {
    const invalidDateString = "2023-13-45";
    const result = isDate(invalidDateString);
    expect(result).toBe(false);
  });

  // Non-date string returns false
  it("should return false when given non-date string", () => {
    const nonDateString = "hello world";
    const result = isDate(nonDateString);
    expect(result).toBe(false);
  });
});

describe("getAvatar", () => {
  // Valid URL with 'cs=' parameter returns correctly formatted string with size
  it("should return URL with correct size when valid URL contains cs parameter", () => {
    const url = "https://example.com/avatar?cs=100&abc=1";
    const size = 200;
    const result = getAvatar(url, size);
    expect(result).toBe("https://example.com/avatar?cs=200x200&abc=1");
  });

  // URL string and numeric size parameter returns expected avatar URL format
  it("should return formatted URL when valid inputs are provided", () => {
    const url = "https://example.com/img?cs=50&other=param";
    const size = 100;
    const result = getAvatar(url, size);
    expect(result).toBe("https://example.com/img?cs=100x100&other=param");
  });

  // Empty URL string returns null
  it("should return null when URL is empty string", () => {
    const url = "";
    const size = 100;
    const result = getAvatar(url, size);
    expect(result).toBeNull();
  });

  // Invalid URL without cs= parameter returns null
  it("should return null when URL does not contain cs parameter", () => {
    const url = "https://example.com/avatar?size=100";
    const size = 200;
    const result = getAvatar(url, size);
    expect(result).toBeNull();
  });

  // Non-string URL parameter returns null
  it("should return null when URL is not a string", () => {
    const url = 123 as any;
    const size = 100;
    const result = getAvatar(url, size);
    expect(result).toBeNull();
  });
});

describe("normilizeDate", () => {
  // Convert valid Date object to Russian locale date string format
  it("should format date to Russian locale string format when given valid date", () => {
    const testDate = new Date("2023-05-15");
    const result = normilizeDate(testDate);
    expect(result).toBe("15.05.2023");
  });

  // Handle current date correctly
  it("should format current date correctly", () => {
    const currentDate = new Date();
    const result = normilizeDate(currentDate);
    const expected = currentDate.toLocaleString("ru").slice(0, 10);
    expect(result).toBe(expected);
  });

  // Handle invalid Date objects
  it("should return invalid date string when given invalid date", () => {
    const invalidDate = new Date("invalid");
    const result = normilizeDate(invalidDate);
    expect(result).toBe("Invalid Da");
  });

  // Process dates before 1970
  it("should format dates before 1970 correctly", () => {
    const oldDate = new Date("1960-03-21");
    const result = normilizeDate(oldDate);
    expect(result).toBe("21.03.1960");
  });

  // Handle future dates
  it("should format future dates correctly", () => {
    const futureDate = new Date("2050-12-31");
    const result = normilizeDate(futureDate);
    expect(result).toBe("31.12.2050");
  });
});

describe("normilizeDateWithHourAndMins", () => {
  // Format valid Date object to Russian locale string with hours and minutes
  it("should format date to Russian locale string with hours and minutes", () => {
    const testDate = new Date("2023-07-15T14:30:00");
    const result = normilizeDateWithHourAndMins(testDate);
    expect(result).toBe("15.07.2023, 14:30");
  });

  // Handle current date and time correctly
  it("should format current date and time correctly", () => {
    const currentDate = new Date();
    const result = normilizeDateWithHourAndMins(currentDate);
    const expected = currentDate.toLocaleString("ru").slice(0, 17);
    expect(result).toBe(expected);
  });

  // Handle Date objects at midnight
  it("should format midnight time correctly", () => {
    const midnightDate = new Date("2023-07-15T00:00:00");
    const result = normilizeDateWithHourAndMins(midnightDate);
    expect(result).toBe("15.07.2023, 00:00");
  });

  // Process dates with single digit days/months
  it("should format single digit days and months correctly", () => {
    const singleDigitDate = new Date("2023-01-05T10:05:00");
    const result = normilizeDateWithHourAndMins(singleDigitDate);
    expect(result).toBe("05.01.2023, 10:05");
  });

  // Handle dates before year 2000
  it("should format dates before year 2000 correctly", () => {
    const oldDate = new Date("1999-12-31T23:59:00");
    const result = normilizeDateWithHourAndMins(oldDate);
    expect(result).toBe("31.12.1999, 23:59");
  });
});

describe("toggleActive", () => {
  // Toggle class 'active' on element with 'active-handler' class when clicked
  it("should add active class to element with active-handler class when clicked", () => {
    const element = document.createElement("div");
    element.classList.add("active-handler");
    document.body.appendChild(element);

    const event = new Event("click");
    Object.defineProperty(event, "target", { value: element });

    toggleActive(event);

    expect(element.classList.contains("active")).toBe(true);
    document.body.removeChild(element);
  });

  // Remove 'active' class from element that already has it
  it("should remove active class when element already has it", () => {
    const element = document.createElement("div");
    element.classList.add("active-handler", "active");
    document.body.appendChild(element);

    const event = new Event("click");
    Object.defineProperty(event, "target", { value: element });

    toggleActive(event);

    expect(element.classList.contains("active")).toBe(false);
    document.body.removeChild(element);
  });

  // Handle event with null target
  it("should not throw error when event target is null", () => {
    const event = new Event("click");
    Object.defineProperty(event, "target", { value: null });

    expect(() => toggleActive(event)).not.toThrow();
  });

  // Handle event target without closest active-handler element
  it("should not toggle class when no active-handler ancestor exists", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    const event = new Event("click");
    Object.defineProperty(event, "target", { value: element });

    toggleActive(event);

    expect(element.classList.contains("active")).toBe(false);
    document.body.removeChild(element);
  });

  // Handle event on element that already has multiple classes
  it("should toggle only active class when element has multiple classes", () => {
    const element = document.createElement("div");
    element.classList.add("active-handler", "other-class", "another-class");
    document.body.appendChild(element);

    const event = new Event("click");
    Object.defineProperty(event, "target", { value: element });

    toggleActive(event);

    expect(element.classList.contains("active")).toBe(true);
    expect(element.classList.contains("other-class")).toBe(true);
    expect(element.classList.contains("another-class")).toBe(true);
    document.body.removeChild(element);
  });
});

describe("debounce", () => {
  // Debounce synchronous function calls with default delay of 500ms
  it("should call sync function once after default delay", () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn);

    debouncedFn("test");
    debouncedFn("test");
    debouncedFn("test");

    expect(mockFn).not.toBeCalled();
    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("test");
  });

  // Debounce asynchronous function calls with default delay
  it("should resolve async function after default delay", async () => {
    jest.useFakeTimers();
    const mockAsyncFn = async () => "result";
    const debouncedFn = debounce(mockAsyncFn);

    const promise = debouncedFn();
    jest.advanceTimersByTime(500);

    const result = await promise;
    expect(result).toBe("result");
  });

  // Handle zero delay value
  it("should execute immediately with zero delay", () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    jest.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  // Handle very large delay values
  it("should work with maximum delay value", () => {
    jest.useFakeTimers();
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, Number.MAX_SAFE_INTEGER);

    debouncedFn();
    jest.advanceTimersByTime(Number.MAX_SAFE_INTEGER);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("getFullName", () => {
  // Returns concatenated name and surname with a space between them
  it("should concatenate name and surname with a space between them", () => {
    const result = getFullName("John", "Doe");
    expect(result).toBe("John Doe");
  });

  // Handles regular strings with letters correctly
  it("should handle regular strings with letters correctly", () => {
    const result = getFullName("Robert", "Smith");
    expect(result).toBe("Robert Smith");
  });

  // Handles empty strings for both name and surname
  it("should handle empty strings for name and surname", () => {
    const result = getFullName("", "");
    expect(result).toBe("");
  });

  // Handles single character inputs
  it("should handle single character inputs correctly", () => {
    const result = getFullName("J", "D");
    expect(result).toBe("J D");
  });

  // Handles strings with multiple spaces between words
  it("should handle strings with multiple spaces between words", () => {
    const result = getFullName("Mary   Jane", "van   der   Berg");
    expect(result).toBe("Mary   Jane van   der   Berg");
  });
});

describe("findFriends", () => {
  // Search returns users when search value matches full name
  it("should return matching users when search matches full name", () => {
    const mockFriends = [
      { name: "John", surname: "Smith" },
      { name: "Jane", surname: "Doe" },
    ];
    const result = findFriends("John Smith", mockFriends);
    expect(result).toEqual([{ name: "John", surname: "Smith" }]);
  });

  // Search matches both name-surname and surname-name combinations
  it("should match users regardless of name-surname order", () => {
    const mockFriends = [{ name: "John", surname: "Smith" }];
    const result1 = findFriends("Smith John", mockFriends);
    const result2 = findFriends("John Smith", mockFriends);
    expect(result1).toEqual(result2);
    expect(result1).toEqual([{ name: "John", surname: "Smith" }]);
  });

  // Handle empty search string
  it("should return all users when search string is empty", () => {
    const mockFriends = [
      { name: "John", surname: "Smith" },
      { name: "Jane", surname: "Doe" },
    ];
    const result = findFriends("", mockFriends);
    expect(result).toEqual(mockFriends);
  });

  // Handle empty friendsData array
  it("should return empty array when friendsData is empty", () => {
    const result = findFriends("John", []);
    expect(result).toEqual([]);
  });

  // Handle special characters in search value
  it("should handle special characters in search value", () => {
    const mockFriends = [
      { name: "John", surname: "Smith-Jones" },
      { name: "Jane", surname: "O'Doe" },
    ];
    const result = findFriends("Smith-Jones", mockFriends);
    expect(result).toEqual([{ name: "John", surname: "Smith-Jones" }]);
  });
});

describe("getGrammaticalEnding", () => {
  // Returns correct word form for numbers 1-4 using last digit
  it("should return correct word form for numbers 1-4 based on last digit", () => {
    const words = ["компьютер", "компьютера", "компьютеров"];
    expect(getGrammaticalEnding(1, words)).toBe("компьютер");
    expect(getGrammaticalEnding(2, words)).toBe("компьютера");
    expect(getGrammaticalEnding(3, words)).toBe("компьютера");
    expect(getGrammaticalEnding(4, words)).toBe("компьютера");
  });

  // Returns correct word form for numbers 5-20 using last two digits
  it("should return correct word form for numbers 5-20", () => {
    const words = ["стол", "стола", "столов"];
    expect(getGrammaticalEnding(5, words)).toBe("столов");
    expect(getGrammaticalEnding(11, words)).toBe("столов");
    expect(getGrammaticalEnding(15, words)).toBe("столов");
    expect(getGrammaticalEnding(20, words)).toBe("столов");
  });

  // Handles zero correctly
  it("should return correct form for zero", () => {
    const words = ["книга", "книги", "книг"];
    expect(getGrammaticalEnding(0, words)).toBe("книг");
  });

  // Handles negative numbers by using absolute value
  it("should handle negative numbers by using absolute value", () => {
    const words = ["день", "дня", "дней"];
    expect(getGrammaticalEnding(-1, words)).toBe("день");
    expect(getGrammaticalEnding(-5, words)).toBe("дней");
    expect(getGrammaticalEnding(-21, words)).toBe("день");
  });

  // Handles large numbers (>1000)
  it("should handle large numbers correctly based on last digits", () => {
    const words = ["час", "часа", "часов"];
    expect(getGrammaticalEnding(1001, words)).toBe("час");
    expect(getGrammaticalEnding(1002, words)).toBe("часа");
    expect(getGrammaticalEnding(1011, words)).toBe("часов");
  });
});
