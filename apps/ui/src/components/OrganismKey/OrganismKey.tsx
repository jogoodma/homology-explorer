import { ORGANISMS } from "../../organisms";

const OrganismKey = () => {
  return (
    <legend className={"flex-none"}>
      <details open>
        <summary className={"font-bold"}>Species key</summary>
        <ol>
          <ul role="list" className={"list-disc list-inside marker:text-3xl"}>
            {ORGANISMS.map((o) => (
              <li key={o.taxid} style={{ color: o.color }}>
                <span className="text-black text-base">
                  {o.genus.charAt(0)}. {o.species} ({o.commonName})
                </span>
              </li>
            ))}
          </ul>
        </ol>
      </details>
    </legend>
  );
};

export default OrganismKey;
