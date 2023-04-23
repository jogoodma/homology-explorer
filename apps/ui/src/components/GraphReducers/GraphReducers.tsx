import { useEffect } from "react";
import { useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { Attributes, EdgeEntry } from "graphology-types";
import { EdgeDisplayData, NodeDisplayData } from "sigma/types";

interface EdgeAttributes extends EdgeDisplayData {
  weight: number;
}

interface GraphReducerProps {
  hiddenNodes: Set<string>;
  hiddenEdges: Set<string>;
}

/**
 * Component responsible for showing/hiding nodes in the graph.
 *
 * @param hiddenNodes - A list of node IDs to hide from the display.
 * @param hiddenEdges - A list of edge IDs to hide from the display.
 */
const GraphReducers = ({ hiddenNodes, hiddenEdges }: GraphReducerProps) => {
  const sigma = useSigma();
  const setSettings = useSetSettings();
  useEffect(() => {
    if (!sigma) {
      return;
    }
    setSettings({
      nodeReducer: (node, data) => {
        const newData: Attributes = { ...data, hidden: false };
        const graph = sigma.getGraph();
        graph.setNodeAttribute(node, "hidden", false);

        // Hide orphaned nodes.
        const numVisibleEdges = graph.filterEdges(node, (edge, attributes) => {
          return !attributes.hidden;
        }).length;

        if (hiddenNodes.has(node)) {
          graph.setNodeAttribute(node, "hidden", true);
          newData.hidden = true;
        } else if (numVisibleEdges === 0) {
          newData.hidden = true;
          graph.setNodeAttribute(node, "hidden", true);
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const newData: Partial<EdgeAttributes> = { ...data, hidden: false };
        const graph = sigma.getGraph();
        graph.setEdgeAttribute(edge, "hidden", false);

        if (hiddenEdges.has(edge)) {
          graph.setEdgeAttribute(edge, "hidden", true);
          newData.hidden = true;
        }
        return newData;
      },
    });
    sigma.refresh();
  }, [setSettings, sigma, hiddenEdges, hiddenNodes]);

  return null;
};

export default GraphReducers;
