import { Browser, launch } from "puppeteer";

import { handler, SearchHandlerInput } from "../src";

const testInput: SearchHandlerInput = {
  query: "Mozart",
  limit: 5,
  geolocation: {
    latitude: 44.4,
    longitude: 44.4,
  },
};

describe("handler", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await launch();
  });
  afterEach(async () => {
    browser.close();
  });

  describe("search", () => {
    it("should yield Success when valid input", async () => {
      const result = await handler(browser, testInput);
      expect(result.success).toBe(true);
    });

    it("should yield Failure when invalid input", async () => {
      const result = await handler(browser, "INVALID INPUT");
      expect(result.success).toBe(false);
    });
  });
});
