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
