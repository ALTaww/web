export async function fetchWithAbort<T>(
  requestFunction: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal
): Promise<T> {
  try {
    const result = requestFunction(signal);
    const data = result instanceof Promise ? await result : result;
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request aborted");
    } else {
      throw err;
    }
    return Promise.reject(err);
  }
}
