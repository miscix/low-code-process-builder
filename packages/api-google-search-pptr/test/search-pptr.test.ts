import { search } from "../src";

describe("search", () => {
  const testQuery = "Mozart";
  const testLimit = 5;
  const testLocation = {
    latitude: 44.4,
    longitude: 44.4,
  };

  it("should return array of results", async () => {
    const result = await search({
      query: testQuery,
      limit: testLimit,
      geolocation: testLocation,
    });

    expect(result).toHaveLength(5);
  });
});
