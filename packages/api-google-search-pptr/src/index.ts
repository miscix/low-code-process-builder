import { initRunnerTopo, dropRunnerTopo, RunnerOptions } from "./runner";
import {
  scrapResults,
  SearchOptions,
  SearchResult,
  submitSearch,
} from "./search";

type FullOptions = RunnerOptions & SearchOptions;

type LocationBasedSearch = (params: FullOptions) => Promise<SearchResult[]>;
export const search: LocationBasedSearch = async (params) => {
  const topo = await initRunnerTopo(params);
  await submitSearch(topo.page, params.query);
  const results = await scrapResults(topo.page, params.limit);
  await dropRunnerTopo(topo);
  return results;
};
