import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { ORGANISMS } from "../../organisms";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Sigma from "sigma";
import { GeneInfo } from "../../types";
interface SpeciesToggleProps {
  sigma: Sigma;
  onChange: (nodeIds: Set<string>) => void;
  enabledSpecies?: Set<number>;
}

const initToggleStates = (species: Set<number>) => {
  return new Map<number, boolean>([...species].map((taxid) => [taxid, true]));
};

const SpeciesToggle = ({
  enabledSpecies = new Set<number>(),
  sigma,
  onChange,
}: SpeciesToggleProps) => {
  // Initialize toggle states variable
  const [toggleStates, setToggleStates] = useState<Map<number, boolean>>(() =>
    initToggleStates(enabledSpecies)
  );

  const nodeSpeciesLookup = useMemo(() => {
    const tmpMap = new Map<string, number>();
    for (const { node, attributes } of sigma.getGraph().nodeEntries()) {
      tmpMap.set(node, (attributes as GeneInfo).speciesid);
    }
    return tmpMap;
  }, [sigma]);

  useEffect(() => {
    const inActiveTaxIds = new Set<number>();
    for (const [taxid, isActive] of toggleStates.entries()) {
      if (!isActive) {
        inActiveTaxIds.add(taxid);
      }
    }
    const nodesToHide = new Set<string>();
    for (const [node, taxid] of nodeSpeciesLookup) {
      if (inActiveTaxIds.has(taxid)) {
        nodesToHide.add(node);
      }
    }
    onChange(nodesToHide);
  }, [toggleStates, nodeSpeciesLookup, onChange]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const taxId = Number.parseInt(e.currentTarget.value);
    setToggleStates((prevToggleStates) => {
      const newToggleState = new Map(prevToggleStates);
      newToggleState.set(taxId, !prevToggleStates.get(taxId));
      return newToggleState;
    });
  };

  return (
    <div>
      <h4 className={"font-bold mb-4"}>Species:</h4>
      <div className={"flex flex-col"}>
        {ORGANISMS.map((species) => (
          <FormControl
            key={species.taxid}
            display={"flex"}
            alignItems={"center"}
            isDisabled={!enabledSpecies.has(species.taxid)}
          >
            <Switch
              id={species.taxid.toString()}
              value={species.taxid}
              isChecked={toggleStates.get(species.taxid)}
              onChange={handleOnChange}
            />
            <FormLabel htmlFor={species.taxid.toString()} mb={0} ml={5}>
              {`${species.genus.charAt(0)}. ${species.species} (${
                species.commonName
              })`}
            </FormLabel>
          </FormControl>
        ))}
      </div>
    </div>
  );
};

export default SpeciesToggle;
