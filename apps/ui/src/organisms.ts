interface Organism {
  taxid: number;
  genus: string;
  species: string;
  commonName: string;
  color: string;
}

export const getOrganism = (taxid: number) => {
  return ORGANISMS.find((o) => o.taxid === taxid);
};

export const ORGANISMS: Organism[] = [
  {
    taxid: 9606,
    genus: "Homo",
    species: "sapiens",
    commonName: "human",
    color: "#a6cee3",
  },
  {
    taxid: 7227,
    genus: "Drosophila",
    species: "melanogaster",
    commonName: "fruit fly",
    color: "#1f78b4",
  },
  {
    taxid: 10090,
    genus: "Mus",
    species: "musculus",
    commonName: "house mouse",
    color: "#b2df8a",
  },
  {
    taxid: 10116,
    genus: "Rattus",
    species: "norvegicus",
    commonName: "Norway rat",
    color: "#33a02c",
  },
  {
    taxid: 3702,
    genus: "Arabidopsis",
    species: "thaliana",
    commonName: "thale cress",
    color: "#fb9a99",
  },
  {
    taxid: 4896,
    genus: "Schizosaccharomyces",
    species: "pombe",
    commonName: "fission yeast",
    color: "#e31a1c",
  },
  {
    taxid: 4932,
    genus: "Saccharomyces",
    species: "cerevisiae",
    commonName: "baker's yeast",
    color: "#fdbf6f",
  },
  {
    taxid: 6239,
    genus: "Caenorhabditis",
    species: "elegans",
    commonName: "worm",
    color: "#ff7f00",
  },
  {
    taxid: 7955,
    genus: "Danio",
    species: "rerio",
    commonName: "zebrafish",
    color: "#cab2d6",
  },
  {
    taxid: 8364,
    genus: "Xenopus",
    species: "tropicalis",
    commonName: "tropical clawed frog",
    color: "#6a3d9a",
  },
];
