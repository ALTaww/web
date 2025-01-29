export async function fetchWithAbort<T>(
  requestFunction: (signal: AbortSignal) => Promise<T> | T,
  signal: AbortSignal
): Promise<T | undefined> {
  try {
    const result = requestFunction(signal);
    const data = result instanceof Promise ? await result : result;
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("Request aborted");
      return undefined;
    } else {
      throw err;
    }
  }
}
