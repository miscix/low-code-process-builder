import { NodeInitializer } from "node-red";
import {
  GoogleCustomSearchNode,
  GoogleCustomSearchNodeDef,
} from "./modules/types";

import { search } from "./modules/api";

const nodeInit: NodeInitializer = (RED): void => {
  function GoogleCustomSearchNodeConstructor(
    this: GoogleCustomSearchNode,
    config: GoogleCustomSearchNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      const query = msg.payload as string;

      search(config, query)
        .then((result) => {
          this.log(result);
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

  RED.nodes.registerType(
    "google-custom-search",
    GoogleCustomSearchNodeConstructor
  );
};

export = nodeInit;
