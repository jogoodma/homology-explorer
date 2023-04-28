export type GeneId = number;
export interface GeneInfo {
  geneid: number;
  symbol: string;
  speciesid: number;
  common_name: string;
  description: string;
  genus: string;
  species: string;
  locus_tag: string;
  chromosome: string;
  map_location?: string;
  gene_type: string;
  species_specific_geneid: string;
  species_specific_geneid_type: string;
}

export interface OrthologPair {
  geneid1: GeneId;
  geneid2: GeneId;
  opb_id: number;
  species1: number;
  species2: number;
  weight: number;
  best_score: string;
  best_score_rev: string;
  confidence: string;
}

export interface Edge {
  key?: number;
  source: number;
  target: number;
  attributes: {
    weight: number;
    [propName: string]: string | number | boolean;
  };
}

export type NodeAttributes = Pick<
  GeneInfo,
  | "symbol"
  | "description"
  | "speciesid"
  | "common_name"
  | "genus"
  | "species"
  | "chromosome"
  | "gene_type"
>;
export interface GeneNode {
  key: GeneId;
  attributes: NodeAttributes;
}

export type GeneInfoMap = Map<number, GeneInfo>;

export interface LinkcomResult {
  key: number;
  source: GeneId;
  target: GeneId;
  attributes: {
    confidence: string;
    homolog_type: "ortholog" | "paralog";
    linkcom: number;
  };
}

type PagerankAttributes = Omit<NodeAttributes, "chromosome"> & {
  pagerank: number;
};

export interface PagerankResult {
  key: number;
  attributes: PagerankAttributes;
}
