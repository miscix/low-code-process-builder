import { Number, Record, Static, String } from "runtypes";
import v from "validator";

export const Url = String.withBrand("Url").withConstraint(v.isURL);
export type Url = Static<typeof Url>;

export const PositiveNumber = Number.withConstraint((x) => x > 0);

export const GeoCoordinates = Record({
  latitude: Number,
  longitude: Number,
});
export type GeoCoordinates = Static<typeof GeoCoordinates>;
