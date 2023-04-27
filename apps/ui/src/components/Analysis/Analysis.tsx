import Sigma from "sigma";
import { fetchLinkcomAnalysis } from "../../helpers/ortholog-pair.helpers";
import { GeneId } from "../../types";
import { useState } from "react";
import { normalize } from "./Analysis.helpers";
import {
  FormControl,
  FormLabel,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

interface AnalysisProps {
  geneid: GeneId;
  sigma: Sigma;
  showLinkcom?: boolean;
  toggleLinkcom: () => void;
}
const Analysis = ({
  geneid,
  sigma,
  showLinkcom = false,
  toggleLinkcom,
}: AnalysisProps) => {
  const handleShowLinkcom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Do this if we are NOT showing linkcom
    if (!showLinkcom) {
      toggleLinkcom();
      const threshold =
        parseFloat(data.get("linkcom_threshold") as string) ?? 0.5;
      const analysis = await fetchLinkcomAnalysis([geneid], threshold);
      const graph = sigma.getGraph();
      // TODO - implement result caching.
      const edgeCats = new Set<number>(
        analysis.map((r) => r.attributes.linkcom)
      );
      const maxCat = Math.max(...edgeCats);
      const minCat = Math.min(...edgeCats);
      analysis.forEach((result) => {
        const { source, target, attributes } = result;
        const edge = graph.edge(source, target);
        if (edge) {
          graph.mergeEdgeAttributes(edge, {
            ...attributes,
            linkcom_norm: normalize(attributes.linkcom, maxCat, minCat),
          });
        }
      });
    } else {
      toggleLinkcom();
    }
  };

  return (
    <div>
      <div>
        <h4 className={"text-slate-600 text-xl"}>Linkcom Analysis</h4>
        <form onSubmit={handleShowLinkcom}>
          <FormControl>
            <FormLabel>Threshold</FormLabel>
            <NumberInput
              name="linkcom_threshold"
              max={1}
              min={0}
              defaultValue={0.5}
              step={0.1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <button
            type={"submit"}
            className="rounded-lg bg-emerald-400 mt-2 p-2 drop-shadow-md active:bg-emerald-600"
          >
            {showLinkcom ? "Hide" : "Show"} Linkcom
          </button>
        </form>
      </div>
    </div>
  );
};

export default Analysis;
