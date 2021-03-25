import { json } from "micro";
import { launch } from "puppeteer";
import { IncomingMessage } from "node:http";

import { SearchAgent, SearchParams } from "./module";

const promisedBrowser = launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

export default async function (req: IncomingMessage) {
  const browser = await promisedBrowser;
  const agent = new SearchAgent(browser);
  const params = (await json(req)) as SearchParams;
  return agent.search(params);
}
