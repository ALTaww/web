import { fetchWithAbort } from "../../utils/fetchWithAbort";

describe("fetchWithAbort", () => {
  // Successfully handles and returns synchronous request results
  it("should return synchronous result when request function returns non-promise value", async () => {
    const mockValue = { data: "test" };
    const mockRequestFn = jest.fn().mockReturnValue(mockValue);
    const mockSignal = new AbortController().signal;

    const result = await fetchWithAbort(mockRequestFn, mockSignal);

    expect(mockRequestFn).toHaveBeenCalledWith(mockSignal);
    expect(result).toEqual(mockValue);
  });

  // Handles null/undefined request function parameter
  it("should throw error when request function is undefined", async () => {
    const mockSignal = new AbortController().signal;
    const requestFn = undefined;

    await expect(async () => {
      await fetchWithAbort(requestFn as any, mockSignal);
    }).rejects.toThrow();
  });
});
