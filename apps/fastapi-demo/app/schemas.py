from pydantic import BaseModel


# GeneInfo
class GeneInfoBase(BaseModel):
    symbol: str
    description: str
    speciesid: int


class GeneInfo(GeneInfoBase):
    geneid: int
    locus_tag: str
    species_specific_geneid: int
    species_specific_geneid_type: str
    chromosome: str
    map_location: str
    gene_type: str
    
    class Config:
        orm_mode = True


# Ortholog Pairs
class OrthologPairsBase(BaseModel):
    geneid1: int
    geneid2: int
    

class OrthologPairs(OrthologPairsBase):
    opb_id: int
    species1: int
    species2: int
    weight: int
    best_score: str
    best_score_rev: str
    confidence: str

    class Config:
        orm_mode = True


# Gene Neighborhood Edges
class GeneNeighborEdgesBase(BaseModel):
    key: str


class GeneNeighborEdgesAttr(BaseModel):
    weight: int

    class Config:
        orm_mode = True


class GeneNeighborEdges(GeneNeighborEdgesBase):
    source: int
    target: int
    attributes: GeneNeighborEdgesAttr | None = None

    class Config:
        orm_mode = True


# Gene Neighborhood Nodes
class GeneNeighborNodesBase(BaseModel):
    key: int


class GeneNeighborNodesAttr(BaseModel):
    symbol: str
    speciesid: int
    description: str
    chromosome: str
    gene_type: str
   
    class Config:
        orm_mode = True


class GeneNeighborNodes(GeneNeighborNodesBase):
    attributes: GeneNeighborNodesAttr | None = None

    class Config:
        orm_mode = True


