import { useEffect } from "react";
import { useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { Attributes, EdgeEntry } from "graphology-types";
import { EdgeDisplayData } from "sigma/types";

interface EdgeAttributes extends EdgeDisplayData {
  weight: number;
}
const FilterScore = () => {
  const sigma = useSigma();
  const setSettings = useSetSettings();
  useEffect(() => {
    if (!sigma) {
      return;
    }
    setSettings({
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const newData: Partial<EdgeAttributes> = { ...data, hidden: false };

        // if ((newData?.weight ?? 0) < 12) {
        //   newData.hidden = true;
        //   const genes = graph.extremities(edge);
        //   genes.forEach((g) => {
        //     console.log(g, graph.degree(g));
        //   });
        // }

        return newData;
      },
    });
  }, [setSettings, sigma]);

  return null;
};

export default FilterScore;
