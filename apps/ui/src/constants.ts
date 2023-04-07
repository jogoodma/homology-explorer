interface Organism {
  taxid: number;
  genus: string;
  species: string;
  commonName: string;
}

type TaxonomyId = 9606 | 7227;

export const organisms: Organism[] = [
  { taxid: 9606, genus: "Homo", species: "sapiens", commonName: "human" },
  {
    taxid: 7227,
    genus: "Drosophila",
    species: "melanogaster",
    commonName: "fruit fly",
  },
];
