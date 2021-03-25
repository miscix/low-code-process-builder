import {
  launch,
  Browser,
  BrowserContext,
  GeolocationOptions,
  Page,
} from "puppeteer";

export const baseUrl = "https://www.google.com";

export const runnerArgs = ["--no-sandbox", "--disable-setuid-sandbox"];

export interface RunnerOptions {
  geolocation: GeolocationOptions;
}

export interface RunnerTopo {
  browser: Browser;
  browserContext: BrowserContext;
  page: Page;
}

type BuildTopo = (options: RunnerOptions) => Promise<RunnerTopo>;
export const initRunnerTopo: BuildTopo = async (options) => {
  const browser = await launch({ args: runnerArgs });

  const browserContext = await browser.createIncognitoBrowserContext();
  await browserContext.clearPermissionOverrides();
  await browserContext.overridePermissions(baseUrl, ["geolocation"]);

  const page = await browserContext.newPage();
  await page.setViewport({ width: 1280, height: 1280 });
  await page.setGeolocation(options.geolocation);
  await page.goto(baseUrl);

  return { browser, browserContext, page };
};

type DestroyTopo = (topo: RunnerTopo) => Promise<void>;
export const dropRunnerTopo: DestroyTopo = async (topo) => {
  await topo.page.close();
  await topo.browserContext.close();
  await topo.browser.close();
};
