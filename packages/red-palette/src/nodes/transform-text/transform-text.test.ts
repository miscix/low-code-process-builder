import testHelper, { TestFlowsItem } from "node-red-node-test-helper";

import transformTextNode from "./transform-text";
import { TransformTextNodeDef } from "./modules/types";
import { TransformTextOperation } from "./shared/types";

type FlowsItem = TestFlowsItem<TransformTextNodeDef>;
type Flows = Array<FlowsItem>;

describe("transform-text node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [
      { id: "n1", type: "transform-text", name: "transform-text" },
    ];
    testHelper.load(transformTextNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("transform-text");
      done();
    });
  });

  describe("in upper-case mode", () => {
    let flows: Flows;
    beforeEach(() => {
      flows = [
        {
          id: "n1",
          type: "transform-text",
          name: "transform-text",
          operation: TransformTextOperation.UpperCase,
          wires: [["n2"]],
        },
        { id: "n2", type: "helper" },
      ];
    });
    it("should make payload upper case, if it's a string", (done) => {
      testHelper.load(transformTextNode, flows, () => {
        const n2 = testHelper.getNode("n2");
        const n1 = testHelper.getNode("n1");
        n2.on("input", (msg: unknown) => {
          expect(msg).toBeTruthy();
          expect(msg).toMatchObject({ payload: "UPPERCASE" });
          done();
        });
        n1.receive({ payload: "UpperCase" });
      });
    });

    it("should just pass a message, if payload is not a string", (done) => {
      testHelper.load(transformTextNode, flows, () => {
        const n2 = testHelper.getNode("n2");
        const n1 = testHelper.getNode("n1");
        n2.on("input", (msg: unknown) => {
          expect(msg).toBeTruthy();
          expect(msg).toMatchObject({ payload: { str: "UpperCase" } });
          done();
        });
        n1.receive({ payload: { str: "UpperCase" } });
      });
    });
  });
});
