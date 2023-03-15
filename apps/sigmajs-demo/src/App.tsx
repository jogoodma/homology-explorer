import { useEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", { x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40" });
    graph.addNode("second", { x: 10, y: 10, size: 10, label: "My second node", color: "#FA4F40" });
    graph.addEdge("first","second")
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const App = () => {
  return (
    <SigmaContainer style={{ height: "1024px", width: "1024px" }}>
      <LoadGraph />
    </SigmaContainer>
  );
};

export default App;