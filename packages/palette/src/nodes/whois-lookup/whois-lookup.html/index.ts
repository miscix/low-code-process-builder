import { EditorRED } from "node-red";
import { WhoisLookupEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<WhoisLookupEditorNodeProperties>("whois-lookup", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "whois lookup",
  label: function () {
    return this.name || "whois lookup";
  },
});
