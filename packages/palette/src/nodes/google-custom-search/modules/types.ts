import { Node, NodeDef } from "node-red";
import { GoogleCustomSearchOptions } from "../shared/types";

export interface GoogleCustomSearchNodeDef extends NodeDef, GoogleCustomSearchOptions {}

// export interface GoogleCustomSearchNode extends Node {}
export type GoogleCustomSearchNode = Node;
