import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { getOrthologPairGraph } from "../../helpers/ortholog-pair.helpers";
import Graph from "graphology";

interface OrthologyGraphLoaderProps {
  geneid: string;
  graph: Graph;
}
const OrthologyGraphLoader = ({ geneid, graph }: OrthologyGraphLoaderProps) => {
  const { positions, assign } = useLayoutForceAtlas2();
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const initGraph = async () => {
      loadGraph(graph);
      assign();
    };
    initGraph();
  }, [loadGraph, assign]);

  return null;
};

export default OrthologyGraphLoader;
