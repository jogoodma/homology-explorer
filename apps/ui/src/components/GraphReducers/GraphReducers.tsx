import { useEffect } from "react";
import { useSetSettings, useSigma } from "@react-sigma/core";
import { Attributes, EdgeEntry } from "graphology-types";
import { EdgeDisplayData, NodeDisplayData } from "sigma/types";

import { interpolateSpectral } from "d3-scale-chromatic";
import { HoveredNodes } from "../../types";

interface EdgeAttributes extends EdgeDisplayData {
  weight: number;
}

interface GraphReducerProps {
  hiddenNodes: Set<string>;
  hiddenEdges: Set<string>;
  hoveredNodes: HoveredNodes | null;
  showLinkcom?: boolean;
  showPagerank?: boolean;
}

/**
 * Component responsible for showing/hiding nodes in the graph.
 *
 * @param hiddenNodes - A list of node IDs to hide from the display.
 * @param hiddenEdges - A list of edge IDs to hide from the display.
 * @param showLinkcom - Whether to show the linkcom attributes as colors.
 */
const GraphReducers = ({
  hiddenNodes,
  hiddenEdges,
  hoveredNodes,
  showLinkcom = false,
  showPagerank = false,
}: GraphReducerProps) => {
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
        const graph = sigma.getGraph();
        if (
          showPagerank &&
          graph &&
          graph.hasNodeAttribute(node, "pagerank_norm")
        ) {
          newData.size = graph.getNodeAttribute(node, "pagerank_norm");
        }
        if (
          hoveredNodes &&
          !hoveredNodes.hoveredNodeNeighbors.has(node) &&
          hoveredNodes.hoveredNode !== node
        ) {
          newData.label = "";
          newData.color = "#dee7ef";
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const newData: Partial<EdgeAttributes> = { ...data, hidden: false };

        if (hiddenEdges.has(edge)) {
          newData.hidden = true;
        }
        const graph = sigma.getGraph();
        if (
          showLinkcom &&
          graph &&
          graph.hasEdgeAttribute(edge, "linkcom_norm")
        ) {
          newData.color = interpolateSpectral(
            graph.getEdgeAttribute(edge, "linkcom_norm")
          );
        }
        if (
          hoveredNodes &&
          !graph.hasExtremity(edge, hoveredNodes.hoveredNode)
        ) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [setSettings, sigma, hiddenEdges, hiddenNodes]);

  return null;
};

export default GraphReducers;
