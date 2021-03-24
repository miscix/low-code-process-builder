import { NodeInitializer } from "node-red";
import { WhoisLookupNode, WhoisLookupNodeDef } from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function WhoisLookupNodeConstructor(
    this: WhoisLookupNode,
    config: WhoisLookupNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType("whois-lookup", WhoisLookupNodeConstructor);
};

export = nodeInit;
