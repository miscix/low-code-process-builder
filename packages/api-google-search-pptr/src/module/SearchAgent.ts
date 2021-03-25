import { Browser, Page, SearchParams, SearchResult } from "./models";
import { baseUrl } from "./config";
import { acquireResults, submitSearch } from "./helpers";

export class SearchAgent {
  static baseUrl: string = baseUrl;

  private readonly browser: Browser;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  private async createBlankPage(): Promise<Page> {
    const browserContext = await this.browser.createIncognitoBrowserContext();
    await browserContext.clearPermissionOverrides();
    await browserContext.overridePermissions(SearchAgent.baseUrl, [
      "geolocation",
    ]);

    return browserContext.newPage();
  }

  public async search(params: SearchParams): Promise<SearchResult[]> {
    const page = await this.createBlankPage();
    if (params.geolocation) {
      await page.setGeolocation(params.geolocation);
    }
    await page.goto(SearchAgent.baseUrl);

    await submitSearch(page, params.query);
    const results = await acquireResults(page, params.limit);

    const browserContext = page.browserContext();
    await page.close();
    await browserContext.close();

    return results;
  }
}
