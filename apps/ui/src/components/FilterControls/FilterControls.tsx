import Sigma from "sigma";
import ScoreSlider from "../ScoreSlider";
import { useEffect, useMemo, useState } from "react";
import { difference, union } from "../../helpers/set-operations.helpers";
import SpeciesToggle from "../SpeciesToggle";
import { GeneInfo } from "../../types";

type FilterControlsCallback = (prev: Set<string>) => Set<string>;
interface FilterControlsProps {
  sigma: Sigma;
  onHiddenEdgesChange: (edgeIds: Set<string>) => void;
  onHiddenNodesChange: (nodeIds: Set<string>) => void;
}
const FilterControls = ({
  sigma,
  onHiddenEdgesChange,
  onHiddenNodesChange,
}: FilterControlsProps) => {
  const [scoreEdgeIds, setScoreEdgeIds] = useState(new Set<string>());
  const [speciesNodeIds, setSpeciesNodeIds] = useState(new Set<string>());

  const graph = sigma.getGraph();

  useEffect(() => {
    // Union of all edge IDs from filters to hide.
    const allEdgesToHide = union(scoreEdgeIds);
    // Union of all edge IDs from filters to hide.
    const allNodesToHide = union(speciesNodeIds);

    // Set hidden edges when the IDs change
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
  }, [
    scoreEdgeIds,
    speciesNodeIds,
    onHiddenEdgesChange,
    onHiddenNodesChange,
    graph,
  ]);

  const taxIds = useMemo(() => {
    if (graph) {
      return new Set(
        graph.mapNodes(
          (node) =>
            graph.getNodeAttribute(node, "speciesid") as GeneInfo["speciesid"]
        )
      );
    }
    return new Set<number>();
  }, [graph]);

  return (
    <>
      <h3 className={"text-2xl text-bolder mb-5"}>Network Filters</h3>
      <div className={"flex flex-row gap-20"}>
        <ScoreSlider
          sigma={sigma}
          onChange={(edges) => setScoreEdgeIds(edges)}
        />
        <SpeciesToggle
          sigma={sigma}
          enabledSpecies={taxIds}
          onChange={(nodes) => setSpeciesNodeIds(nodes)}
        />
      </div>
    </>
  );
};

export default FilterControls;
