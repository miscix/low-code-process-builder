import { EditorRED } from "node-red";
import { GoogleCustomSearchEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<GoogleCustomSearchEditorNodeProperties>(
  "google-custom-search",
  {
    category: "CRM Utils",
    color: "#a6bbcf",
    defaults: {
      name: { value: "" },
      apiKey: { value: "", required: true },
      searchEngineId: { value: "", required: true },
    },
    inputs: 1,
    outputs: 2,
    icon: "file.png",
    paletteLabel: "google custom search",
    label: function () {
      return this.name || "google custom search";
    },
  }
);
