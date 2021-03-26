const { json } = require("micro");
const puppeteer = require("puppeteer");

const { handler } = require(".");

const promisedBrowser = puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

module.exports = async function (req) {
  const browser = await promisedBrowser;
  const handle = (input) => handler(browser, input);

  return json(req).then(handle);
};
