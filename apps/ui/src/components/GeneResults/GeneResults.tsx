import { GeneInfo } from "../../types";
import { Link } from "react-router-dom";
import { getOrganism } from "../../organisms";

interface GeneResultsProps {
  results: GeneInfo[];
}
export const GeneResults = ({ results }: GeneResultsProps) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="max-h-screen overflow-auto w-1/2 pt-4">
      {results.map((gene) => {
        const org = getOrganism(gene.speciesid);
        let species = org
          ? `${org.genus.charAt(0)}. ${org.species}`
          : "Unknown";

        return (
          <div
            key={gene.geneid}
            className={"flex flex-row justify-between py-2 hover:bg-indigo-100"}
          >
            <div className={"font-bold basis-1/2"}>{gene.symbol}</div>
            <div className={"basis-1/4"}>{species}</div>
            <div className={"basis-1/4"}>
              <Link
                to={`/network/gene/${gene.geneid}`}
                className={
                  "bg-teal-500 hover:bg-teal-700 p-2 text-white rounded-lg"
                }
              >
                View Network
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GeneResults;
