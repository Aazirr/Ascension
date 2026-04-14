import type { GraphNode, GraphNodeKind } from "@/types";

export type NodeTier = 1 | 2 | 3;

const folderByKind: Record<GraphNodeKind, string> = {
  central: "tier-1-central",
  category: "tier-2-category",
  leaf: "tier-3-leaf",
};

export function getNodeTier(kind: GraphNodeKind): NodeTier {
  if (kind === "central") {
    return 1;
  }

  if (kind === "category") {
    return 2;
  }

  return 3;
}

export function getNodeIconFolder(kind: GraphNodeKind): string {
  return folderByKind[kind];
}

export function getNodeIconPath(node: Pick<GraphNode, "id" | "kind">): string {
  return `/icons/${getNodeIconFolder(node.kind)}/${node.id}.svg`;
}

export function getNodeDefaultIconPath(kind: GraphNodeKind): string {
  return `/icons/${getNodeIconFolder(kind)}/_default.svg`;
}
