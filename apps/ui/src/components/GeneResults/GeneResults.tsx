import { GeneInfo } from "../../types";

interface GeneResultsProps {
  results: GeneInfo[];
}
export const GeneResults = ({ results }: GeneResultsProps) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="max-h-96 overflow-auto">
      {results.map((gene) => (
        <p key={gene.geneid}>
          {gene.symbol} {gene.description}
        </p>
      ))}
    </div>
  );
};

export default GeneResults;
