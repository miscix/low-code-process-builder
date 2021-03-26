import { Page } from "../ports";
import { Url } from "../common";
import { SearchResultItem } from "./models";

//

type RNG = () => number;

//

abstract class BasePageManager {
  public readonly page: Page;

  public readonly random: RNG = Math.random;

  constructor(page: Page) {
    this.page = page;
  }

  protected get shortDelay() {
    return this.random() * 100;
  }
  protected get longDelay() {
    return this.shortDelay * 10;
  }
}

export class EntryPageManager extends BasePageManager {
  private static readonly selectors = {
    searchInput: "form[action='/search'] input[type='text']",
  };

  constructor(page: Page) {
    super(page);
  }

  public static async load(page: Page, url: Url) {
    const { searchInput: inputSelector } = EntryPageManager.selectors;

    await page.goto(url);
    await page.waitForSelector(inputSelector);

    return new EntryPageManager(page);
  }

  public async submitQuery(query: string) {
    const { page } = this;
    const { searchInput: inputSelector } = EntryPageManager.selectors;

    await page.type(inputSelector, query, { delay: this.shortDelay }); // Types slower, like a user

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
      page.keyboard.press("Enter"),
    ]);

    return new ResultsPageManager(page);
  }
}

export class ResultsPageManager extends BasePageManager {
  private static readonly selectors = {
    resultItem: "#search a[onmousedown], #search a[ping]",
    nextPageLink: "#pnnext",
  };

  constructor(page: Page) {
    super(page);
  }

  public async parseResults() {
    const { page } = this;

    const items: unknown[] = await page.evaluate((itemSelector: string) => {
      const selection = document.querySelectorAll(itemSelector);

      const parseOne = (el: Element) => {
        const titleHolder = el.querySelector("h3") || { textContent: null };

        const title = titleHolder.textContent;
        const link = el.getAttribute("href");

        return { title, link };
      };

      return [].slice.apply(selection).map(parseOne);
    }, ResultsPageManager.selectors.resultItem);

    return items.filter(SearchResultItem.guard);
  }

  public async loadNext(): Promise<ResultsPageManager | null> {
    const { page } = this;
    const { nextPageLink, resultItem } = ResultsPageManager.selectors;

    const existsNext = await page.$(nextPageLink);

    if (!existsNext) return null;

    await page.waitForTimeout(this.longDelay);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
      page.click(nextPageLink, { delay: this.shortDelay }),
    ]);

    await page.waitForSelector(resultItem);

    return new ResultsPageManager(page);
  }
}
