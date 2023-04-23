import { useCallback, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import type { EdgeEntry } from "graphology-types";
import type Sigma from "sigma";
import { GeneNetwork } from "../../components/GeneNetwork";
import OrganismKey from "../../components/OrganismKey";
import { EdgeDisplayData } from "sigma/types";
import FilterControls from "../../components/FilterControls";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };
  const [sigma, setSigma] = useState<Sigma | null>(null);

  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [hiddenEdges, setHiddenEdges] = useState<Set<string>>(new Set());

  const handleHiddenEdgesChange = useCallback(
    (edgeIds: Set<string>) => setHiddenEdges(edgeIds),
    [setHiddenEdges]
  );
  const handleHiddenNodesChange = useCallback(
    (nodeIds: Set<string>) => setHiddenNodes(nodeIds),
    [setHiddenNodes]
  );

  if (!geneid) return null;
  return (
    <>
      <section className={"flex flex-row p-10 justify-around"}>
        <div className="border-2 border-slate-300">
          <GeneNetwork
            geneid={geneid}
            graph={graph}
            sigmaRef={setSigma}
            hiddenNodes={hiddenNodes}
            hiddenEdges={hiddenEdges}
          />
        </div>
        <OrganismKey />
      </section>
      <section className={"pl-10"}>
        <FilterControls
          sigma={sigma}
          onHiddenEdgesChange={handleHiddenEdgesChange}
          onHiddenNodesChange={handleHiddenNodesChange}
        />
      </section>
    </>
  );
};

export default GeneNetworkPage;
