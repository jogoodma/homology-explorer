import { useState } from "react";
import GeneSearch from "../components/GeneSearch";
import type { GeneInfo } from "../types";
// TODO - Replace with API call.
import jsonData from "../../../../data/human_gene_info.json";
import { GeneResults } from "../components/GeneResults";

const geneInfoData = jsonData as GeneInfo[];

export default function Home() {
  // State variable for keeping track of user input.
  const [gene, setGene] = useState<string | null>(null);

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
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-28 bg-indigo-700 justify-items-start flex flex-col justify-center">
        <h1 className="text-slate-50 text-5xl pl-8">Homology Explorer</h1>
      </header>
      <main className="flex-auto flex flex-col items-center">
        <section id="search" className="mt-20 w-3/5 p-8">
          <GeneSearch onChange={(value) => setGene(value)} />
          <GeneResults results={geneResults} />
        </section>
      </main>
      <footer className="h-14 flex items-center justify-center">
        <p>Brought to you by Mark Green and Josh Goodman</p>
      </footer>
    </div>
  );
}
