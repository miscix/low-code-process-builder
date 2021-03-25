import { Browser, launch, Page } from "puppeteer";

export const acquireTitle = async (url: string): Promise<string> => {
  const browser: Browser = await launch();
  const page: Page = await browser.newPage();

  await page.goto(url);

  const title = await page.title();

  await browser.close();

  return title;
};

describe("pptr", () => {
  test("acquireTitle", async () => {
    const targetUrl = "https://example.com";
    const title = await acquireTitle(targetUrl);
    expect(title).toMatch("Example");
  });
});
