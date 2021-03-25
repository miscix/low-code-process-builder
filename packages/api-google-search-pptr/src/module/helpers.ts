import { isSearchResult, Page, SearchResult } from "./models";
import {
  defaultSearchResultLimit,
  queryTypingDelay,
  searchInputSelector,
  searchResultSelector,
} from "./config";

type SearchSubmitter = (page: Page, query: string) => Promise<void>;
export const submitSearch: SearchSubmitter = async (page, query) => {
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

type ResultLoader = (page: Page, limit?: number) => Promise<SearchResult[]>;
export const acquireResults: ResultLoader = async (
  page,
  limit = defaultSearchResultLimit
) => {
  const allResults: SearchResult[] = [];

  const parseResults = async (): Promise<SearchResult[]> => {
    await page.waitForSelector(searchResultSelector);

    const results = await page.evaluate(function (itemSelector: string) {
      const selection = document.querySelectorAll(itemSelector);
      const arr: Element[] = [].slice.apply(selection);

      const parseOne = (el: Element): Partial<SearchResult> => {
        const titleHolder = el.querySelector("h3") || { textContent: null };
        const title = titleHolder.textContent || undefined;
        const url = el.getAttribute("href") || undefined;

        return { title, url };
      };
      return arr.map(parseOne);
    }, searchResultSelector);

    return results.filter(isSearchResult);
  };

  async function scrapNextBatch() {
    console.log("Random timeout");
    await page.waitForTimeout(Math.floor(1000 + Math.random() * 2000));
    // await saveHtmlAndImg(++nextIndex);
    console.log("Waiting for the page results");
    console.log("Parsing the page results");

    const newLinks = await parseResults();

    allResults.push.apply(allResults, newLinks);
    if (allResults.length > limit) {
      return allResults;
    }

    const existsNext = await page.$("#pnnext");
    if (!existsNext) {
      return allResults;
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

  return allResults.slice(0, limit);
};
