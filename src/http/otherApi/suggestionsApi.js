import { $host } from "..";

class SuggestionsApi {
  getSettlements = async (query, signal) => {
    const { data } = await $host.get("/settlements/" + query, {
      signal,
    });
    return data;
  };
}

const suggestionsApi = new SuggestionsApi();
export default suggestionsApi;
