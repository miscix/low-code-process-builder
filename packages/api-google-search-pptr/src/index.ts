import { json } from "micro";
import { launch } from "puppeteer";
import { IncomingMessage } from "http";

import { SearchAgent, SearchParams } from "./module";

const promisedBrowser = launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

export default async function (req: IncomingMessage) {
  const browser = await promisedBrowser;

  return json(req)
    .then(SearchParams.check)
    .then((params) => new SearchAgent(browser).search(params));
}
