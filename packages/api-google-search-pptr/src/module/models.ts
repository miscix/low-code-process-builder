import { Record, String, Number, Static, Partial, Array } from "runtypes";
import v from "validator";

export { Browser, Page } from "puppeteer";

export const Url = String.withConstraint(v.isURL);
export type Url = Static<typeof Url>;

export const NaturalNumber = Number.withConstraint(
  (x) => Math.floor(x) === x
).withConstraint((x) => x > 0);

export const GeoCoordinates = Record({
  latitude: Number,
  longitude: Number,
});
export type GeoCoordinates = Static<typeof GeoCoordinates>;

export const SearchParams = Record({
  query: String,
}).And(
  Partial({
    limit: NaturalNumber,
    geolocation: GeoCoordinates,
  })
);
export type SearchParams = Static<typeof SearchParams>;

export const SearchResultItem = Record({
  title: String,
  link: Url,
});
export type SearchResultItem = Static<typeof SearchResultItem>;

export const SearchResult = Record({
  items: Array(SearchResultItem),
});
export type SearchResult = Static<typeof SearchResult>;
