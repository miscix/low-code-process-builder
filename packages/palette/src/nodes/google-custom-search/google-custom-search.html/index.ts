import { EditorRED } from "node-red";
import { GoogleCustomSearchEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GoogleCustomSearchEditorNodeProperties>("google-custom-search", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "google custom search",
  label: function () {
    return this.name || "google custom search";
  },
});
