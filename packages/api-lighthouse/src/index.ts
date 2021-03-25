import { json } from "micro";
import { IncomingMessage } from "node:http";

export default async function (req: IncomingMessage) {
  const data = await json(req);
  console.log(data);

  return "ok";
}
