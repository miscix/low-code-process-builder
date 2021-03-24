import testHelper, { TestFlowsItem } from "node-red-node-test-helper";

import whoisLookupNode from "./whois-lookup";
import { WhoisLookupNodeDef } from "./modules/types";

type FlowsItem = TestFlowsItem<WhoisLookupNodeDef>;
type Flows = Array<FlowsItem>;

describe("whois-lookup node", () => {
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
      { id: "n1", type: "whois-lookup", name: "whois-lookup" },
    ];
    testHelper.load(whoisLookupNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("whois-lookup");
      done();
    });
  });

  describe("lookup", () => {
    let flows: Flows;
    beforeEach(() => {
      flows = [
        {
          id: "n1",
          type: "whois-lookup",
          name: "whois-lookup",
          wires: [["n2"]],
        },
        { id: "n2", type: "helper" },
      ];
    });

    // it("should make payload upper case, if it's a string", (done) => {
    //   testHelper.load(transformTextNode, flows, () => {
    //     const n2 = testHelper.getNode("n2");
    //     const n1 = testHelper.getNode("n1");
    //     n2.on("input", (msg: unknown) => {
    //       expect(msg).toBeTruthy();
    //       expect(msg).toMatchObject({ payload: "UPPERCASE" });
    //       done();
    //     });
    //     n1.receive({ payload: "UpperCase" });
    //   });
    // });

    it("should just pass a message", (done) => {
      testHelper.load(whoisLookupNode, flows, () => {
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
