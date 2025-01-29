import axios from "axios";

// Добавляем поддержку AbortController в axios
export const axiosWithAbort = (config) => {
  const { signal, ...restConfig } = config;

  if (signal) {
    // Создаем токен отмены для axios
    const cancelToken = axios.CancelToken.source();
    signal.addEventListener("abort", () => {
      cancelToken.cancel("Request was aborted");
    });

    return { ...restConfig, cancelToken: cancelToken.token };
  }

  return restConfig;
};
