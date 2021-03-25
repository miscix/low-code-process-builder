import { GeolocationOptions } from "puppeteer";

import { initRunnerTopo, dropRunnerTopo } from "./runner";
import { scrapResults, submitSearch, SearchResult } from "./search";

export type SearchParams = {
  query: string;
  limit?: number;
  geolocation?: GeolocationOptions;
};

type LocationBasedSearch = (params: SearchParams) => Promise<SearchResult[]>;
export const search: LocationBasedSearch = async (params) => {
  const topo = await initRunnerTopo(params.geolocation);
  await submitSearch(topo.page, params.query);
  const results = await scrapResults(topo.page, params.limit);
  await dropRunnerTopo(topo);
  return results;
};
