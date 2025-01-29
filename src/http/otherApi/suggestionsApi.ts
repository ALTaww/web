import { $host } from "..";
import { ISuggestions } from "../../types/types";

class SuggestionsApi {
  getSettlements = async (
    query: string,
    signal: AbortSignal
  ): Promise<ISuggestions[]> => {
    const { data } = await $host.get("/settlements/" + query, {
      signal,
    });
    return data;
  };
}

const suggestionsApi = new SuggestionsApi();
export default suggestionsApi;
