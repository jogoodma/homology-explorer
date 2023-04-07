import { GeneInfo } from "../../types";
import { Link } from "react-router-dom";

interface GeneResultsProps {
  results: GeneInfo[];
}
export const GeneResults = ({ results }: GeneResultsProps) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="max-h-96 overflow-auto">
      {results.map((gene) => (
        <div
          key={gene.geneid}
          className={"flex flex-row justify-between px-10"}
        >
          <div>Gene: {gene.symbol}</div>
          <div>Species: {gene.speciesid}</div>
          <div>
            <Link to={`/network/gene/${gene.geneid}`}>View Network</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneResults;
