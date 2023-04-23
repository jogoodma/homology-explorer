import Sigma from "sigma";
import ScoreSlider from "../ScoreSlider";
import { useEffect, useState } from "react";
import { difference, union } from "../../helpers/set-operations.helpers";

type FilterControlsCallback = (prev: Set<string>) => Set<string>;
interface FilterControlsProps {
  sigma: Sigma | null;
  onHiddenEdgesChange: (edgeIds: Set<string>) => void;
  onHiddenNodesChange: (nodeIds: Set<string>) => void;
}
const FilterControls = ({
  sigma,
  onHiddenEdgesChange,
  onHiddenNodesChange,
}: FilterControlsProps) => {
  const [scoreEdgeIds, setScoreEdgeIds] = useState(new Set<string>());

  useEffect(() => {
    // Union of all edge IDs from filters to hide.
    const allEdgesToHide = union(scoreEdgeIds);
    // Union of all edge IDs from filters to hide.
    const allNodesToHide = union(new Set<string>());

    // Set hidden edges when the IDs change
    const graph = sigma?.getGraph();
    if (graph) {
      const allNodes = graph.nodes();
      if (allNodes) {
        allNodes.forEach((node) => {
          const edges = new Set(graph.edges(node));
          // Check which edges we are removing.
          const visibleEdges = difference(edges, allEdgesToHide);

          // Hide orphaned nodes
          if (visibleEdges.size === 0) {
            allNodesToHide.add(node);
          }
        });
      }
    }
    onHiddenEdgesChange(allEdgesToHide);
    onHiddenNodesChange(allNodesToHide);
  }, [scoreEdgeIds, onHiddenEdgesChange, onHiddenNodesChange, sigma]);

  return (
    <div>
      <h3 className={"text-2xl text-bolder mb-5"}>Network Filters</h3>
      <ScoreSlider sigma={sigma} onChange={(edges) => setScoreEdgeIds(edges)} />
    </div>
  );
};

export default FilterControls;
