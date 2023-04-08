import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import { GeneNetwork } from "../../components/GeneNetwork";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };

  if (!geneid) return null;
  return (
    <div className="border-2 border-slate-300 m-10">
      <GeneNetwork geneid={geneid} graph={graph} />
    </div>
  );
};

export default GeneNetworkPage;
