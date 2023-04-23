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
        if (hiddenNodes.has(node)) {
          newData.hidden = true;
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const newData: Partial<EdgeAttributes> = { ...data, hidden: false };

        if (hiddenEdges.has(edge)) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [setSettings, sigma, hiddenEdges, hiddenNodes]);

  return null;
};

export default GraphReducers;
