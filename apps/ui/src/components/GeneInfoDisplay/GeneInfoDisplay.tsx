import { GeneInfo } from "../../types";
import { ReactNode } from "react";
import GeneLink from "../GeneLink";

interface GeneInfoDisplayProps {
  info?: GeneInfo;
}
const Label = ({ children }: { children: ReactNode }) => {
  return <dt className={"font-bold text-gray-500"}>{children}</dt>;
};
const Value = ({ children }: { children: ReactNode }) => {
  return <dd className={"font-bold"}>{children}</dd>;
};
const GeneInfoDisplay = ({ info }: GeneInfoDisplayProps) => {
  if (!info) return null;
  return (
    <>
      <h3 className={"text-2xl text-bolder mb-5"}>Selected Gene Information</h3>
      {!info && <p>No information available</p>}
      <dl className={"grid grid-cols-4 gap-6 w-5/6"}>
        <Label>ID:</Label>
        <Value>
          <GeneLink
            id={info.species_specific_geneid}
            database={info.species_specific_geneid_type}
          />
        </Value>

        <Label>Symbol:</Label>
        <Value>{info.symbol}</Value>

        <Label>Species:</Label>
        <Value>
          {info.genus.charAt(0)}. {info.species} ({info.common_name})
        </Value>

        <Label>Description:</Label>
        <Value>{info.description}</Value>

        <Label>Gene Type:</Label>
        <Value>{info.gene_type}</Value>

        <Label>Chromosome:</Label>
        <Value>{info.chromosome}</Value>
      </dl>
    </>
  );
};

export default GeneInfoDisplay;
