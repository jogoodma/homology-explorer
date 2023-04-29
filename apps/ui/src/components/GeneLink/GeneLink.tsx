interface GeneLinkProps {
  id: string;
  database: string;
}

const noLinkDbs = ["ARAPORT"];
const GeneLink = ({ id, database }: GeneLinkProps) => {
  let dbName = database;
  switch (database.toUpperCase()) {
    case "FLYBASE":
      dbName = "FB";
      break;
    case "WORMBASE":
      dbName = "WB";
      break;
    default:
      break;
  }
  if (noLinkDbs.includes(database.toUpperCase())) {
    return (
      <>
        {id} ({database})
      </>
    );
  }
  const url =
    dbName.toUpperCase() === "POMBASE"
      ? `https://www.pombase.org/gene/${id}`
      : `https://alliancegenome.org/gene/${dbName}:${id}`;
  return (
    <a target={"_blank"} rel={"noreferrer"} href={url}>
      <span className={"text-blue-600 hover:underline pr-4"}>{id}</span>(
      {database})
    </a>
  );
};

export default GeneLink;
