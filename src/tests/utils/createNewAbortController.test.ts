import { createNewAbortController } from "../../utils/createNewAbortController";

describe("createNewAbortController", () => {
  // Function creates new AbortController when abortControllerRef.current is null
  it("should create new AbortController when ref is null", () => {
    const abortControllerRef = { current: null };

    const result = createNewAbortController(abortControllerRef);

    expect(result.controller).toBeInstanceOf(AbortController);
    expect(result.signal).toBe(result.controller.signal);
    expect(abortControllerRef.current).toBe(result.controller);
  });

  // Function handles case when abortControllerRef is undefined
  it("should throw error when abortControllerRef is undefined", () => {
    const abortControllerRef = undefined;

    expect(() => {
      createNewAbortController(abortControllerRef as any);
    }).toThrow();
  });
});
