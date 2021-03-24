import { EditorNodeProperties } from "node-red";
import { WhoisLookupOptions } from "../../shared/types";

export interface WhoisLookupEditorNodeProperties
  extends EditorNodeProperties,
    WhoisLookupOptions {}
