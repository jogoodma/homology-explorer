import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";
import { GeneInfo } from "../../types";
import { fetchGeneInfo } from "../../helpers/ortholog-pair.helpers";

export interface GeneInfoDisplayTriggerProps {
  onClick: (geneInfo: GeneInfo | undefined) => void;
}
const GeneInfoDisplayTrigger = ({ onClick }: GeneInfoDisplayTriggerProps) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  useEffect(() => {
    // Register the events
    registerEvents({
      clickNode: async (e) => {
        try {
          const geneId = parseInt(e.node);
          const geneInfo = await fetchGeneInfo([geneId]);
          onClick(geneInfo.get(geneId));
        } catch (error: any) {
          console.error("Error while fetching gene info after click:", error);
        }
      },
    });
  }, [registerEvents, sigma]);

  return null;
};

export default GeneInfoDisplayTrigger;
