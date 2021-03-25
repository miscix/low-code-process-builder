import { json } from "micro";
import { IncomingMessage } from "node:http";

import { search, SearchParams } from "./module";

export default async function (req: IncomingMessage) {
  const data = (await json(req)) as SearchParams;
  return search(data);
}
