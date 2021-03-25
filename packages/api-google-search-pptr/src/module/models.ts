import { GeolocationOptions as GeoCoordinates } from "puppeteer";

export { Browser, Page } from "puppeteer";

export type SearchParams = {
  query: string;
  limit?: number;
  geolocation?: GeoCoordinates;
};

export interface SearchResult {
  title: string;
  url: string;
}

export const isSearchResult = (x: Partial<SearchResult>): x is SearchResult =>
  typeof x.url === "string" && typeof x.title === "string";
