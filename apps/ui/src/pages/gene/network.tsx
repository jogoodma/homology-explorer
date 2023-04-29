import { ChangeEvent, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Graph from "graphology";
import type Sigma from "sigma";
import { GeneNetwork } from "../../components/GeneNetwork";
import OrganismKey from "../../components/OrganismKey";
import FilterControls from "../../components/FilterControls";
import { GeneInfo, LayoutType, LayoutTypes } from "../../types";
import { getOrganism, ORGANISMS } from "../../organisms";
import Analysis from "../../components/Analysis";
import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";

const GeneNetworkPage = () => {
  const { geneid } = useParams();
  // TODO avoid casting here.
  const { graph } = useLoaderData() as { graph: Graph };
  const [sigma, setSigma] = useState<Sigma | null>(null);

  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [hiddenEdges, setHiddenEdges] = useState<Set<string>>(new Set());
  const [showLinkcom, setShowLinkcom] = useState<boolean>(false);
  const [showPagerank, setShowPagerank] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutType>("forceatlas2");

  const toggleLinkcom = () => setShowLinkcom((prevState) => !prevState);
  const togglePagerank = () => setShowPagerank((prevState) => !prevState);

  const handleLayoutChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLayout(e.currentTarget.value as LayoutType);
  };

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
      <div className={"ml-14 w-1/6"}>
        <FormControl>
          <FormLabel>Layout</FormLabel>
          <Select onChange={handleLayoutChange} size={"sm"}>
            {LayoutTypes.map((lt) => {
              return (
                <option key={lt} value={lt} selected={layout === lt}>
                  {lt}
                </option>
              );
            })}
          </Select>
        </FormControl>
      </div>
      <section className={"flex flex-row m-10 justify-around"}>
        <div className="border-2 border-slate-300">
          <GeneNetwork
            geneid={geneid}
            graph={graph}
            sigmaRef={setSigma}
            hiddenNodes={hiddenNodes}
            hiddenEdges={hiddenEdges}
            showLinkcom={showLinkcom}
            showPagerank={showPagerank}
            layout={layout}
          />
        </div>
        <div className={"flex flex-col gap-6"}>
          <OrganismKey />
          {sigma && (
            <Analysis
              sigma={sigma}
              geneid={parseInt(geneid)}
              showLinkcom={showLinkcom}
              toggleLinkcom={toggleLinkcom}
              showPagerank={showPagerank}
              togglePagerank={togglePagerank}
            />
          )}
        </div>
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
