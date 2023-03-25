import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import Gexf from "graphology-gexf";
import Graph from "graphology";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { useLayoutCircular } from "@react-sigma/layout-circular";

const GexfGraphLoader = () => {
  // const { positions, assign } = useLayoutForceAtlas2();
  const { positions, assign } = useLayoutCircular();
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const fetchNetwork = async () => {
      const response = await fetch("2911.gexf");
      if (response.ok) {
        const data = await response.text();
        const graph = Gexf.parse(Graph, data);
        console.log("Graph parsed OK");
        assign();
        console.log(positions());
        loadGraph(graph);
      }
    };
    fetchNetwork();
  }, [loadGraph, assign]);

  return null;
};

export default GexfGraphLoader;
