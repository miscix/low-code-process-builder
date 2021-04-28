import { EditorRED } from "node-red";
import { WhoisLookupEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<WhoisLookupEditorNodeProperties>("whois-lookup", {
  category: "CRM Utils",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
    apiKey: { value: "", required: true },
  },
  inputs: 1,
  outputs: 2,
  icon: "file.png",
  paletteLabel: "whois lookup",
  label: function () {
    return this.name || "whois lookup";
  },
});
