interface Organism {
  taxid: number;
  genus: string;
  species: string;
  commonName: string;
  color: string;
}

export const ORGANISMS: Organism[] = [
  {
    taxid: 9606,
    genus: "Homo",
    species: "sapiens",
    commonName: "human",
    color: "#003F5C",
  },
  {
    taxid: 7227,
    genus: "Drosophila",
    species: "melanogaster",
    commonName: "fruit fly",
    color: "#2F4B7C",
  },
  {
    taxid: 10090,
    genus: "Mus",
    species: "musculus",
    commonName: "house mouse",
    color: "#665191",
  },
  {
    taxid: 10116,
    genus: "Rattus",
    species: "norvegicus",
    commonName: "Norway rat",
    color: "#A05195",
  },
  {
    taxid: 3702,
    genus: "Arabidopsis",
    species: "thaliana",
    commonName: "thale cress",
    color: "#D45087",
  },
  {
    taxid: 4896,
    genus: "Schizosaccharomyces",
    species: "pombe",
    commonName: "fission yeast",
    color: "#F95D6A",
  },
  {
    taxid: 4932,
    genus: "Saccharomyces",
    species: "cerevisiae",
    commonName: "baker's yeast",
    color: "#FF7C43",
  },
  {
    taxid: 6239,
    genus: "Caenorhabditis",
    species: "elegans",
    commonName: "worm",
    color: "#FF5722",
  },
  {
    taxid: 7955,
    genus: "Danio",
    species: "rerio",
    commonName: "zebrafish",
    color: "#5BC0EB",
  },
  {
    taxid: 8364,
    genus: "Xenopus",
    species: "tropicalis",
    commonName: "tropical clawed frog",
    color: "#4CAF50",
  },
];
