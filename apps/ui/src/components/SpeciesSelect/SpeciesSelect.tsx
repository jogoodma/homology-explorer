import { ORGANISMS } from "../../organisms";

export const SpeciesSelect = () => {
  return (
    <select id={"species"} name={"species"}>
      {ORGANISMS.map((o) => (
        <option key={o.taxid} value={o.taxid}>
          {o.genus} {o.species} ({o.commonName}
        </option>
      ))}
    </select>
  );
};

export default SpeciesSelect;
