import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import type Sigma from "sigma";
import { GeneNetwork } from "../../components/GeneNetwork";
import OrganismKey from "../../components/OrganismKey";
import FilterControls from "../../components/FilterControls";
import { GeneInfo } from "../../types";
import { getOrganism, ORGANISMS } from "../../organisms";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };
  const [sigma, setSigma] = useState<Sigma | null>(null);

  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [hiddenEdges, setHiddenEdges] = useState<Set<string>>(new Set());

  if (!geneid || !graph) return null;

  const geneInfo = graph.getNodeAttributes(geneid) as GeneInfo;
  const species = getOrganism(geneInfo.speciesid);

  return (
    <>
      <h2 className={"font-bold m-5 text-slate-500"}>
        Homolog Network for Gene:
        <span className={"text-black text-xl pl-3 pr-2"}>
          {geneInfo.symbol}
        </span>
        (
        <span className={"italic"}>
          {species?.genus.charAt(0)}. {species?.species}
        </span>
        )
      </h2>
      <section className={"flex flex-row m-10 justify-around"}>
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
      <section className={"px-10"}>
        {sigma && (
          <FilterControls
            sigma={sigma}
            onHiddenEdgesChange={setHiddenEdges}
            onHiddenNodesChange={setHiddenNodes}
          />
        )}
      </section>
    </>
  );
};

export default GeneNetworkPage;
