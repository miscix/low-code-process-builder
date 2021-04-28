import { EditorNodeProperties } from "node-red";
import { GoogleCustomSearchOptions } from "../../shared/types";

export interface GoogleCustomSearchEditorNodeProperties
  extends EditorNodeProperties,
    GoogleCustomSearchOptions {}
