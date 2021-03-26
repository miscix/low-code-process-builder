import { Browser, launch } from "puppeteer";

import { SearchParams, SearchAgent } from "../src/module";

describe("SearchAgent", () => {
  let browser: Browser;
  let agent: SearchAgent;

  const testInputParams: SearchParams = {
    query: "Mozart",
    limit: 5,
    geolocation: {
      latitude: 44.4,
      longitude: 44.4,
    },
  };

  beforeEach(async () => {
    browser = await launch();
    agent = new SearchAgent(browser);
  });
  afterEach(async () => {
    browser.close();
  });

  describe("search", () => {
    it("should return array of results", async () => {
      const result = await agent.search(testInputParams);
      expect(result.items).toHaveLength(testInputParams.limit as number);
    });
  });
});
