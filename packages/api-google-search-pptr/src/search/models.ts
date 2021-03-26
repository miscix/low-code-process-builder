import {
  Array,
  Literal,
  Optional,
  Record,
  Static,
  String,
  Unknown,
} from "runtypes";

import { PositiveNumber, Url } from "../common";

export const SearchParams = Record({
  query: String,
  limit: Optional(PositiveNumber),
});
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

//

export const Success = Record({
  tag: Literal("Success"),
  data: SearchResult,
});
export type Success = Static<typeof Success>;

export const Failure = Record({
  tag: Literal("Failure"),
  data: Unknown,
});
export type Failure = Static<typeof Failure>;

export const Result = Success.Or(Failure);
export type Result = Static<typeof Result>;
