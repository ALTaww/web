export const fetchWithAbort = async (requestFunction, signal) => {
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
  }
};
