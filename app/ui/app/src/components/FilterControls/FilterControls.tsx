import Sigma from "sigma";
import ScoreSlider from "../ScoreSlider";
import { useEffect, useState } from "react";

interface FilterControlsProps {
  sigma: Sigma | null;
  setHiddenEdges: (edgeIds: Set<string>) => void;
}
const FilterControls = ({ sigma, setHiddenEdges }: FilterControlsProps) => {
  const [scoreIds, setScoreIds] = useState(new Set<string>());

  // Set hidden edges when the IDs change
  useEffect(() => {
    console.log(scoreIds);
    setHiddenEdges(scoreIds);
  }, [scoreIds, setHiddenEdges]);
  return (
    <div>
      <h3 className={"text-2xl text-bolder mb-5"}>Network Filters</h3>
      <ScoreSlider sigma={sigma} onChange={(edges) => setScoreIds(edges)} />
    </div>
  );
};

export default FilterControls;
