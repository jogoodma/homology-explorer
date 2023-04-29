import Sigma from "sigma";
import {
  fetchLinkcomAnalysis,
  fetchPagerankAnalysis,
} from "../../helpers/ortholog-pair.helpers";
import { GeneId } from "../../types";
import { normalize } from "./Analysis.helpers";
import { scaleLinear } from "d3-scale";
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
  showPagerank?: boolean;
  togglePagerank: () => void;
}
const Analysis = ({
  geneid,
  sigma,
  showLinkcom = false,
  toggleLinkcom,
  showPagerank = false,
  togglePagerank,
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
      const scale = scaleLinear([minCat, maxCat], [0, 1]);
      analysis.forEach((result) => {
        const { source, target, attributes } = result;
        const edge = graph.edge(source, target);
        if (edge) {
          graph.mergeEdgeAttributes(edge, {
            ...attributes,
            linkcom_norm: scale(attributes.linkcom),
          });
        }
      });
    } else {
      toggleLinkcom();
    }
  };

  const handleShowPagerank = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Do this if we are NOT showing linkcom
    if (!showPagerank) {
      togglePagerank();
      const alpha = parseFloat(data.get("pagerank_alpha") as string) ?? 0.85;
      const analysis = await fetchPagerankAnalysis([geneid], alpha);
      const graph = sigma.getGraph();
      // TODO - implement result caching.
      const pagerankValues = analysis.map((node) => node.attributes.pagerank);
      const max = Math.max(...pagerankValues);
      const min = Math.min(...pagerankValues);
      const scale = scaleLinear([min, max], [2, 50]);
      analysis.forEach((result) => {
        const {
          key,
          attributes: { pagerank },
        } = result;
        const node = graph.findNode((n) => n === key.toString());
        if (node) {
          graph.mergeNodeAttributes(node, {
            pagerank,
            pagerank_norm: scale(pagerank),
          });
        }
      });
    } else {
      togglePagerank();
    }
  };

  return (
    <div className={"flex flex-col gap-10"}>
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
      <div>
        <h4 className={"text-slate-600 text-xl"}>Pagerank Analysis</h4>
        <form onSubmit={handleShowPagerank}>
          <FormControl>
            <FormLabel>Alpha</FormLabel>
            <NumberInput
              name="pagerank_alpha"
              max={1}
              min={0}
              defaultValue={0.85}
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
            {showPagerank ? "Hide" : "Show"} Pagerank
          </button>
        </form>
      </div>
    </div>
  );
};

export default Analysis;
