import { NodeInitializer } from "node-red";
import { GoogleCustomSearchNode, GoogleCustomSearchNodeDef } from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function GoogleCustomSearchNodeConstructor(
    this: GoogleCustomSearchNode,
    config: GoogleCustomSearchNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType("google-custom-search", GoogleCustomSearchNodeConstructor);
};

export = nodeInit;
