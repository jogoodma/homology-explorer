import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import Graph from "graphology";

interface OrthologyGraphLoaderProps {
  geneid: string;
  graph: Graph;
}

/**
 * Loader used by react-sigma to load the graphology graph data.
 * Data is pre-fetched by react-router and passed into this component
 * as a property.
 *
 * See the loader for the /network/gene route in `src/main.tsx`.
 *
 * @param geneid - The gene ID
 * @param graph - The graphology graph object.
 */
const OrthologyGraphLoader = ({ geneid, graph }: OrthologyGraphLoaderProps) => {
  const { assign } = useLayoutForceAtlas2();
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
