import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";
import { HoveredNodes } from "../../types";

export interface GeneHoverEventProps {
  onEnterNode: (hoveredNodes: HoveredNodes) => void;
  onLeaveNode: () => void;
}
const GeneHoverEvent = ({ onLeaveNode, onEnterNode }: GeneHoverEventProps) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  useEffect(() => {
    // Register the events
    registerEvents({
      enterNode: (event) => {
        const graph = sigma.getGraph();
        const hoveredNode = event.node;
        const nodeNeighbors = new Set(graph.neighbors(hoveredNode));
        onEnterNode({ hoveredNode, hoveredNodeNeighbors: nodeNeighbors });
      },
      leaveNode: (event) => {
        onLeaveNode();
      },
    });
  }, [registerEvents, sigma]);

  return null;
};

export default GeneHoverEvent;
