import { json, sendError } from "micro";
import { IncomingMessage, ServerResponse } from "node:http";

import * as lighthouse from "lighthouse";

import { launch } from "chrome-launcher";

type OutputFormat = "json" | "html";

interface InputParams {
  url: string;
  format?: OutputFormat;
}

async function acquireAnalytics(url: string, format: OutputFormat = "json") {
  const chrome = await launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance"],
    port: chrome.port,
  };
  const runnerResult = await lighthouse(url, options);

  await chrome.kill();

  switch (format) {
    case "json":
      const { audits, categories } = runnerResult.lhr;
      return { audits, categories };
    case "html":
      return runnerResult.report;
  }
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const data = (await json(req)) as InputParams;

  return acquireAnalytics(data.url, data.format).catch((err) =>
    sendError(req, res, { message: err.message })
  );
}
