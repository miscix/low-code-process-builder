import { NodeInitializer } from "node-red";

import { WhoisLookupNode, WhoisLookupNodeDef } from "./modules/types";
import { lookup } from "./modules/api";

const nodeInit: NodeInitializer = (RED): void => {
  function WhoisLookupNodeConstructor(
    this: WhoisLookupNode,
    config: WhoisLookupNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      const lookupParams = {
        key: config.apiKey,
        domain: msg.payload as string,
      };

      lookup(lookupParams)
        .then((result: unknown) => {
          msg.payload = result;
          send([msg, null]);
        })
        .catch((error: unknown) => {
          msg.payload = error;
          send([null, msg]);
        })
        .then(() => done());
    });
  }

  RED.nodes.registerType("whois-lookup", WhoisLookupNodeConstructor);
};

export = nodeInit;
