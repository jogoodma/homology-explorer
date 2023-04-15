import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import type Sigma from "sigma";
import { GeneNetwork } from "../../components/GeneNetwork";
import OrganismKey from "../../components/OrganismKey";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };
  const [sigma, setSigma] = useState<Sigma | null>(null);

  if (!geneid) return null;
  return (
    <section className={"flex flex-row m-10 justify-around"}>
      <div className="border-2 border-slate-300">
        <GeneNetwork geneid={geneid} graph={graph} sigmaRef={setSigma} />
      </div>
      <OrganismKey />
    </section>
  );
};

export default GeneNetworkPage;
