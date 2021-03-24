import request from "axios";

import { apiEndpoint as baseURL } from "../shared/constants";

interface LookupParams {
  key: string;
  domain: string;
}

export const lookup = (params: LookupParams): Promise<unknown> =>
  request({ baseURL, params }).then((res) => res.data);
