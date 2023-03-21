from pydantic import BaseModel


class GeneInfoBase(BaseModel):
    description: str


class GeneInfoCreate(GeneInfoBase):
    pass


class GeneInfo(GeneInfoBase):
    geneid: int
    speciesid: int
    symbol: str
    locus_tag: str
    species_specific_geneid: int
    species_specific_geneid_type: str
    chromosome: str
    map_location: str
    gene_type: str
    
    class Config:
        orm_mode = True


class OrthologPairsBase(BaseModel):
    species1: int
    geneid1: int
    species2: int
    geneid2: int


class OrthologPairsCreate(OrthologPairsBase):
    pass


class OrthologPairs(OrthologPairsBase):
    opb_id: int
    weight: int
    best_score: str
    best_score_rev: str
    confidence: str

    class Config:
        orm_mode = True

