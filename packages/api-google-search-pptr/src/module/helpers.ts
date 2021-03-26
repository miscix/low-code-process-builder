import { Page, SearchResultItem } from "./models";

//

export const searchInputSelector = "form[action='/search'] input[type='text']";
export const searchResultSelector = "#search a[onmousedown], #search a[ping]";
export const nextPageLinkSelector = "#pnnext";

//

const randomAround = (n: number): number =>
  Math.random() * n + (0.5 - Math.random()) * (n / 2);

const concat = <T>(arr1: T[]) => (arr2: T[]): T[] => [...arr1, ...arr2];

//

export const submitSearch = async (page: Page, query: string) => {
  console.log("Waiting for the input");
  await page.waitForSelector(searchInputSelector);

  console.log("Typing the search term");
  await page.type(searchInputSelector, query, { delay: randomAround(100) }); // Types slower, like a user

  await Promise.all([
    page.waitForNavigation({
      waitUntil: "networkidle0",
    }),
    page.keyboard.press("Enter"),
  ]);
};

const parseResults = async (page: Page): Promise<SearchResultItem[]> => {
  console.log("Parsing the page results");

  const items: unknown[] = await page.evaluate((itemSelector: string) => {
    const selection = document.querySelectorAll(itemSelector);

    const parseOne = (el: Element) => {
      const titleHolder = el.querySelector("h3") || { textContent: null };

      const title = titleHolder.textContent;
      const link = el.getAttribute("href");

      return { title, link };
    };

    return [].slice.apply(selection).map(parseOne);
  }, searchResultSelector);

  return items.filter(SearchResultItem.guard);
};

export const acquireResults = async (page: Page, limit: number) => {
  let items: SearchResultItem[] = [];
  let hasNext: boolean = true;

  while (items.length < limit && hasNext) {
    items = await parseResults(page).then(concat(items));
    hasNext = await openNext(page);
  }

  return items.slice(0, limit);
};

const openNext = async (page: Page): Promise<boolean> => {
  const existsNext = await page.$(nextPageLinkSelector);

  if (!existsNext) return false;

  console.log("Random timeout");
  await page.waitForTimeout(randomAround(500));

  await Promise.all([
    page.waitForNavigation({
      waitUntil: "networkidle0",
    }),
    page.click(nextPageLinkSelector, { delay: 20 }),
  ]);

  console.log("Waiting for the page results");
  await page.waitForSelector(searchResultSelector);

  return true;
};
