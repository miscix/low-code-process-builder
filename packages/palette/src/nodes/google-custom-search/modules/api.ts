import request from "axios";

import { GoogleCustomSearchOptions as SearchOptions } from "../shared/types";

export const baseURL = "https://customsearch.googleapis.com/customsearch/v1";

export const search = (
  options: SearchOptions,
  query: string
): Promise<unknown> => {
  const params = { q: query, key: options.apiKey, cx: options.searchEngineId };
  return request({ baseURL, params }).then((res) => res.data);
};
