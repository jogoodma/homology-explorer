import Graph from "graphology";
import { random } from "graphology-layout";
import { LoaderFunctionArgs } from "react-router-dom";

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
    addNodes(graph, geneid1, geneid2);
    addEdge(graph, geneid1, geneid2);
  });
  random.assign(graph);
  console.debug("Finished preparing graph");
  return graph;
};

const addEdge = (graph: Graph, source: number, target: number) => {
  if (!graph.hasEdge(source, target)) {
    graph.addEdge(source, target);
  }
};

const addNodes = (graph: Graph, ...nodes: number[]) => {
  nodes.map((node) => {
    if (!graph.hasNode(node)) {
      graph.addNode(node, { size: 10, label: node });
    }
  });
};
