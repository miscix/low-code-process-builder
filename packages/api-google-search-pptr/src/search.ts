import { Page } from "puppeteer";

export const searchInputSelector = "form[action='/search'] input[type='text']";
export const resultSelector = "#search a[onmousedown], #search a[ping]";

export const queryTypingDelay = 100; // mspk

export interface SearchOptions {
  query: string;
  limit: number;
}

export interface CompleteResult {
  resultType: "complete";
  title: string;
  url: string;
}
export interface PartialResult {
  resultType: "partial";
  title: string | null;
  url: string | null;
}
export type SearchResult = CompleteResult | PartialResult;
export const isCompleteResult = (
  value: SearchResult
): value is CompleteResult => value.resultType === "complete";

type ScrapResults = (page: Page, limit: number) => Promise<SearchResult[]>;
export const scrapResults: ScrapResults = async (page, limit) => {
  const allLinks: SearchResult[] = [];

  async function scrapNextBatch() {
    console.log("Random timeout");
    await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000));
    // await saveHtmlAndImg(++nextIndex);
    console.log("Waiting for the page results");
    console.log("Parsing the page results");

    const newLinks = await extractResults(page);

    allLinks.push.apply(allLinks, newLinks);
    if (allLinks.length > limit) {
      return allLinks;
    }

    const existsNext = await page.$("#pnnext");
    if (!existsNext) {
      return allLinks;
    }

    console.log("Random timeout");
    await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000));
    console.log("Going to the next page");
    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
      await page.click("#pnnext", { delay: 20 }),
    ]);
    await scrapNextBatch();

    return [];
  }

  await scrapNextBatch();

  return allLinks.slice(0, limit);
};

type SubmitSearch = (page: Page, query: string) => Promise<void>;
export const submitSearch: SubmitSearch = async (page, query) => {
  console.log("Waiting for the input");
  await page.waitForTimeout(2000);
  await page.waitForSelector(searchInputSelector);

  console.log("Typing the search term");
  await page.type(searchInputSelector, query, { delay: queryTypingDelay }); // Types slower, like a user

  await Promise.all([
    page.waitForNavigation({
      waitUntil: "networkidle0",
    }),
    await page.keyboard.press("Enter"),
  ]);
  await page.waitForTimeout(100);
  // console.log("Waiting for the response");
  //await page.waitForResponse(res => {
  //    return res.url().includes("/search")
  //})
};

type ExtractResults = (page: Page) => Promise<CompleteResult[]>;
export const extractResults: ExtractResults = async (page) => {
  await page.waitForSelector(resultSelector);

  const results = await page.evaluate(function (itemSelector: string) {
    const selection = document.querySelectorAll(itemSelector);
    const arr: Element[] = [].slice.apply(selection);

    const parseOne = (el: Element): SearchResult => {
      const titleHolder = el.querySelector("h3") || { textContent: null };
      const title = titleHolder.textContent || null;
      const url = el.getAttribute("href") || null;

      return title && url
        ? { title, url, resultType: "complete" }
        : { title, url, resultType: "partial" };
    };
    return arr.map(parseOne);
  }, resultSelector);

  return results.filter(isCompleteResult);
};
