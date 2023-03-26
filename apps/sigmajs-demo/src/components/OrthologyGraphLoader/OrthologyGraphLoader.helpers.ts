import Graph from "graphology";
import { random } from "graphology-layout";

interface OrthologPair {
  geneid1: number;
  geneid2: number;
  opb_id: number;
  species1: number;
  species2: number;
  weight: number;
  best_score: string;
  best_score_rev: string;
  confidence: string;
}
const fetchOrthologPairs = async (): Promise<OrthologPair[]> => {
  const response = await fetch(`/api/OrthologPairs/2911/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(response.statusText);
  }
};

export const createGraph = async () => {
  const orthologPairs = await fetchOrthologPairs();
  const graph = new Graph();
  orthologPairs.forEach((op, i) => {
    const { geneid1, geneid2 } = op;
    addNodes(graph, geneid1, geneid2);
    addEdge(graph, geneid1, geneid2);
  });
  random.assign(graph);
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
