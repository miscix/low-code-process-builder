import { Browser, launch } from "puppeteer";

import { SearchParams } from "../src/search/models";
import { SearchAgent, AgentOptions } from "../src/search/SearchAgent";

const testAgentOptions: Partial<AgentOptions> = {
  geolocation: {
    latitude: 44.4,
    longitude: 44.4,
  },
};

const testInputParams: SearchParams = {
  query: "Mozart",
  limit: 5,
};

describe("SearchAgent", () => {
  let browser: Browser;
  let agent: SearchAgent;

  beforeEach(async () => {
    browser = await launch();
    agent = new SearchAgent(browser, testAgentOptions);
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
