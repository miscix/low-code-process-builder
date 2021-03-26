import { Optional, Record, Static } from "runtypes";

import { Browser, Page } from "../ports";
import { concat, GeoCoordinates, Url } from "../common";

import { SearchParams, SearchResult, SearchResultItem } from "./models";
import { EntryPageManager, ResultsPageManager } from "./SearchPageManager";

//

export const baseUrl: Url = Url.check("https://google.com");

//

export const AgentOptions = Record({
  geolocation: Optional(GeoCoordinates),
});
export type AgentOptions = Static<typeof AgentOptions>;

//

export class SearchAgent implements AgentOptions {
  private readonly browser: Browser;
  public readonly baseUrl: Url = baseUrl;
  public readonly geolocation?: GeoCoordinates;

  constructor(browser: Browser, options: Partial<AgentOptions> = {}) {
    this.browser = browser;
    this.geolocation = options.geolocation;

    this.search = this.search.bind(this);
  }

  private async createBlankPage(): Promise<Page> {
    const browserContext = await this.browser.createIncognitoBrowserContext();
    await browserContext.clearPermissionOverrides();
    await browserContext.overridePermissions(this.baseUrl, ["geolocation"]);

    const page: Page = await browserContext.newPage();
    if (this.geolocation) {
      await page.setGeolocation(this.geolocation);
    }

    return page;
  }

  private async destroyPage(page: Page): Promise<void> {
    await page.close();
    await page.browserContext().close();
  }

  public async search({ query, limit }: SearchParams): Promise<SearchResult> {
    const page = await this.createBlankPage();
    const entryPage = await EntryPageManager.load(page, this.baseUrl);

    let items: SearchResultItem[] = [];
    let resultPage: ResultsPageManager | null;

    resultPage = await entryPage.submitQuery(query);

    if (!limit) {
      items = await resultPage.parseResults();
      return { items };
    }

    while (resultPage && items.length < limit) {
      items = await resultPage.parseResults().then(concat(items));
      resultPage = await resultPage.loadNext();
    }

    await this.destroyPage(page);

    return {
      items: items.slice(0, limit),
    };
  }
}
