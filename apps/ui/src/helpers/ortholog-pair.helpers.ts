import Graph from "graphology";
import { random } from "graphology-layout";
import { LoaderFunctionArgs } from "react-router-dom";

import { ORGANISMS } from "../organisms";

type GeneId = number;
interface OrthologPair {
  geneid1: GeneId;
  geneid2: GeneId;
  opb_id: number;
  species1: number;
  species2: number;
  weight: number;
  best_score: string;
  best_score_rev: string;
  confidence: string;
}
const fetchOrthologPairs = async (geneid: string): Promise<OrthologPair[]> => {
  console.debug("Fetching ortholog pairs");
  const response = await fetch(`/api/orthologpairs/gene/${geneid}/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(response.statusText);
  }
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.debug("Loader called with params:", params);
  // TODO - Look into how to properly type params without casting.
  const { geneid } = params as { geneid: string };
  return { graph: await getOrthologPairGraph(geneid) };
};

export const getOrthologPairGraph = async (geneid: string) => {
  console.debug("Preparing ortholog graph");
  const orthologPairs = await fetchOrthologPairs(geneid);
  const graph = new Graph();
  orthologPairs.forEach((op, i) => {
    const { geneid1, geneid2 } = op;
    addNodes(graph, op);
    addEdge(graph, op);
  });
  random.assign(graph);
  console.debug("Finished preparing graph");
  return graph;
};

const addEdge = (graph: Graph, orthoPair: OrthologPair) => {
  const { geneid1: source, geneid2: target, weight: size, ...rest } = orthoPair;
  if (!graph.hasEdge(source, target)) {
    graph.addEdge(source, target, { size, label: `Score: ${size}`, ...rest });
  }
};

const organismNodeColors = ORGANISMS.reduce<Record<number, string>>(
  (orgColors, org) => {
    orgColors[org.taxid] = org.color;
    return orgColors;
  },
  {}
);
const addNodes = (graph: Graph, op: OrthologPair) => {
  const nodes = [
    [op.geneid1, op.species1],
    [op.geneid2, op.species2],
  ];
  nodes.map(([node, species]) => {
    if (!graph.hasNode(node)) {
      graph.addNode(node, {
        size: 17,
        label: node,
        color: organismNodeColors[species] ?? "grey",
      });
    }
  });
};
