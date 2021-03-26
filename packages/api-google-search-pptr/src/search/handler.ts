import { Result, Static } from "runtypes";

import { Browser } from "../ports";
import { SearchParams, SearchResult } from "./models";
import { AgentOptions, SearchAgent } from "./SearchAgent";

export const SearchHandlerInput = SearchParams.And(AgentOptions);
export type SearchHandlerInput = Static<typeof SearchHandlerInput>;

export async function handler(
  browser: Browser,
  input: unknown
): Promise<Result<SearchResult>> {
  try {
    const searchParams = SearchParams.check(input);
    const agentOptions = AgentOptions.check(input);

    const agent = new SearchAgent(browser, agentOptions);
    const data = await agent.search(searchParams);

    return { success: true, value: data };
  } catch (error) {
    const message =
      typeof error.message === "string"
        ? error.message
        : "Unknown error happened";
    return { success: false, message };
  }
}
