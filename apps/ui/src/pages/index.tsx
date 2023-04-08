import { useEffect, useState } from "react";
import GeneSearch from "../components/GeneSearch";
import type { GeneInfo } from "../types";
import { GeneResults } from "../components/GeneResults";

export default function Home() {
  // State variable for keeping track of user input.
  const [gene, setGene] = useState<string | null>(null);
  const [geneInfoData, setGeneInfoData] = useState<GeneInfo[]>([]);

  useEffect(() => {
    const getGeneSearchResults = async () => {
      const data = await fetch(`/api/search/gene/symbol/${gene}/`);
      const jsonData: GeneInfo[] = await data.json();
      setGeneInfoData(jsonData);
    };
    if (gene && gene.length > 0) {
      getGeneSearchResults();
    }
  }, [gene]);

  const geneResults = geneInfoData
    .filter((geneInfo) => {
      if (gene === null || gene.length === 0) {
        return false;
      } else {
        return geneInfo.symbol.toLowerCase().includes(gene.toLowerCase());
      }
    })
    .slice(0, 19);

  return (
    <section id="search" className="mt-20 w-3/5 p-8">
      <GeneSearch onChange={(value) => setGene(value)} />
      <GeneResults results={geneResults} />
    </section>
  );
}
