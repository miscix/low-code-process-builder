import testHelper, { TestFlowsItem } from "node-red-node-test-helper";

import googleCustomSearchNode from "./google-custom-search";
import { GoogleCustomSearchOptions } from "./shared/types";
import { GoogleCustomSearchNodeDef } from "./modules/types";

type FlowsItem = TestFlowsItem<GoogleCustomSearchNodeDef>;
type Flows = Array<FlowsItem>;

// assets

const testConfig: GoogleCustomSearchOptions = {
  apiKey: "AIzaSyD_Ucrx3qxHwVgqdrUMiCvs5uHrPPo6_iY",
  searchEngineId: "541abf5ffc7594805",
};
const testQuery = "Mozart";

// test

describe("google-custom-search node", () => {
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
      {
        id: "n1",
        type: "google-custom-search",
        name: "google-custom-search",
        ...testConfig,
      },
    ];
    testHelper.load(googleCustomSearchNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("google-custom-search");
      done();
    });
  });

  describe("lookup", () => {
    let flows: Flows;
    beforeEach(() => {
      flows = [
        {
          id: "n1",
          type: "google-custom-search",
          name: "google-custom-search",
          wires: [["n2"]],
        },
        { id: "n2", type: "helper" },
      ];
    });

    it("should yield whois info if available", (done) => {
      testHelper.load(googleCustomSearchNode, flows, () => {
        const n2 = testHelper.getNode("n2");
        const n1 = testHelper.getNode("n1");
        n2.on("input", (msg: unknown) => {
          expect(msg).toBeTruthy();
          console.log(msg);
          // expect(msg).toMatchObject({ payload: testInputs.valid });
          done();
        });
        n1.receive({ payload: testQuery });
      });
    });
  });
});
