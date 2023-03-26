import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { createGraph } from "./OrthologyGraphLoader.helpers";

const OrthologyGraphLoader = () => {
  const { positions, assign } = useLayoutForceAtlas2();
  // const { positions, assign } = useLayoutCircular();
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const initGraph = async () => {
      const graph = await createGraph();
      loadGraph(graph);
      assign();
    };
    initGraph();
  }, [loadGraph, assign]);

  return null;
};

export default OrthologyGraphLoader;
