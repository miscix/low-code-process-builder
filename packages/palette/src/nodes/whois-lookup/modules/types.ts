import { Node, NodeDef } from "node-red";
import { WhoisLookupOptions } from "../shared/types";

export interface WhoisLookupNodeDef extends NodeDef, WhoisLookupOptions {}

// export interface WhoisLookupNode extends Node {}
export type WhoisLookupNode = Node;
