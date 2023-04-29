import Graph from "graphology";
import { random } from "graphology-layout";
import { LoaderFunctionArgs } from "react-router-dom";

import { ORGANISMS } from "../organisms";
import type {
  Edge,
  GeneId,
  GeneInfo,
  GeneInfoMap,
  GeneNode,
  LinkcomResult,
  OrthologPair,
  PagerankResult,
} from "../types";

export const fetchGeneInfo = async (
  geneids: number[]
): Promise<GeneInfoMap> => {
  try {
    const response = await fetch("/api/geneinfo/multigene/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        genes: geneids,
      }),
    });
    const geneInfo: GeneInfo[] = await response.json();
    // Create a map/dict for fast retrieval of gene information.
    return new Map<number, GeneInfo>(geneInfo.map((gi) => [gi.geneid, gi]));
  } catch (error) {
    console.error(`Error fetching gene info for: ${error}`);
  }
  return new Map();
};

const fetchNetworkNeighborNodes = async (
  geneid: string
): Promise<GeneNode[]> => {
  console.debug("Fetching gene neighbor nodes");
  const response = await fetch(`/api/geneneighbornodes/gene/${geneid}/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(response.statusText);
  }
};

const fetchOrthologPairs = async (geneid: string): Promise<OrthologPair[]> => {
  console.debug("Fetching ortholog pairs");
  const response = await fetch(`/api/orthologpairs/gene/${geneid}/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw Error(response.statusText);
  }
};
const fetchNetworkNeighborEdges = async (geneid: string): Promise<Edge[]> => {
  console.debug("Fetching gene neighbor edges");
  const response = await fetch(`/api/geneneighboredges/gene/${geneid}/`);
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
  const geneNodes = await fetchNetworkNeighborNodes(geneid);
  // Get a unique list of all gene IDs in network.
  //const geneIds = [...new Set(geneNodes.map((gn) => gn.key))];
  //const geneInfo = await fetchGeneInfo(geneIds);
  const neighborEdges = await fetchNetworkNeighborEdges(geneid);
  const graph = new Graph({
    allowSelfLoops: false,
    type: "undirected",
    multi: false,
  });
  geneNodes.forEach((gn, i) => {
    addGeneNode(graph, gn);
  });
  neighborEdges.forEach((edge) => {
    addEdge({ graph, neighborEdge: edge });
  });
  random.assign(graph);
  console.debug("Finished preparing graph");
  return graph;
};

interface AddEdgeProps {
  graph: Graph;
  orthoPair?: OrthologPair;
  neighborEdge?: Edge;
}
const addEdge = ({ graph, orthoPair, neighborEdge }: AddEdgeProps) => {
  let edge: Edge;
  if (orthoPair) {
    const { geneid1: source, geneid2: target, weight, ...rest } = orthoPair;
    edge = {
      source,
      target,
      attributes: {
        weight,
        size: weight,
        ...rest,
      },
    };
  } else if (neighborEdge) {
    const { source, target, attributes } = neighborEdge;
    const { weight, ...rest } = attributes;
    edge = {
      source,
      target,
      attributes: {
        weight,
        size: weight,
      },
    };
  } else {
    return;
  }
  if (!edge || !edge?.source || !edge?.target) return;

  if (!graph.hasEdge(edge.source, edge.target)) {
    graph.addEdge(edge.source, edge.target, edge.attributes);
  }
};

const organismNodeColors = ORGANISMS.reduce<Record<number, string>>(
  (orgColors, org) => {
    orgColors[org.taxid] = org.color;
    return orgColors;
  },
  {}
);
const addGeneNode = (graph: Graph, gene: GeneNode) => {
  if (!graph.hasNode(gene.key)) {
    const { symbol, speciesid, ...rest } = gene.attributes;
    const label = symbol ?? gene.key;
    graph.addNode(gene.key, {
      size: 10,
      label,
      color: organismNodeColors[speciesid] ?? "grey",
      speciesid,
      symbol,
      ...rest,
    });
  }
};

const addNodes = (graph: Graph, op: OrthologPair, gi: GeneInfoMap) => {
  const nodes = [
    [op.geneid1, op.species1],
    [op.geneid2, op.species2],
  ];
  nodes.map(([node, species]) => {
    if (!graph.hasNode(node)) {
      const geneInfo = gi.get(node);
      const label = geneInfo?.symbol ?? node;
      graph.addNode(node, {
        size: 10,
        label,
        color: organismNodeColors[species] ?? "grey",
        ...geneInfo,
      });
    }
  });
};

export const fetchLinkcomAnalysis = async (
  geneIds: GeneId[],
  threshold: number = 0.5
): Promise<LinkcomResult[]> => {
  try {
    const response = await fetch(
      `/api/geneneighboredges/multigene/linkcom?threshold=${threshold}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genes: geneIds,
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching linkcom analysis result for: ${error}`);
  }
  return [];
};
export const fetchPagerankAnalysis = async (
  geneIds: GeneId[],
  alpha: number = 0.85
): Promise<PagerankResult[]> => {
  try {
    const response = await fetch(
      `/api/geneneighbornodes/multigene/pagerank?alpha=${alpha}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genes: geneIds,
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching pagerank analysis result for: ${error}`);
  }
  return [];
};
