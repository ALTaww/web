export const createNewAbortController = (abortControllerRef) => {
  if (!abortControllerRef || !abortControllerRef.current) return {};
  // Отменяем предыдущие запросы
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  // Создаем новый AbortController
  abortControllerRef.current = new AbortController();
  return {
    controller: abortControllerRef.current,
    signal: abortControllerRef.current.signal,
  };
};
