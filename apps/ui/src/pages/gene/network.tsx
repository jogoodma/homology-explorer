import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import type { EdgeEntry } from "graphology-types";
import type Sigma from "sigma";
import { GeneNetwork } from "../../components/GeneNetwork";
import OrganismKey from "../../components/OrganismKey";
import { EdgeDisplayData } from "sigma/types";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };
  const [sigma, setSigma] = useState<Sigma | null>(null);

  const filterScore = (e: React.MouseEvent) => {
    if (sigma) {
      sigma.getGraph().forEachEdge((edge, data) => {
        const res: Partial<EdgeDisplayData> = { ...data };
        if (data.weight > 12) {
          res.hidden = true;
        }
      });
    }
  };

  if (!geneid) return null;
  return (
    <>
      <section className={"flex flex-row m-10 justify-around"}>
        <div className="border-2 border-slate-300">
          <GeneNetwork geneid={geneid} graph={graph} sigmaRef={setSigma} />
        </div>
        <OrganismKey />
      </section>
      <section>
        <button
          className="rounded-full bg-indigo-500 p-3 text-white"
          onClick={filterScore}
        >
          Filter node scores
        </button>
      </section>
    </>
  );
};

export default GeneNetworkPage;
