from pydantic import BaseModel


# SymbolSearch
class SymbolSearch(BaseModel):
    geneid: int
    symbol: str
    speciesid: int
    common_name: str
    frequency: int | None = None
    
    class Config:
        orm_mode = True
  

# GeneInfo
class GeneInfoBase(BaseModel):
    description: str
    geneid: int
    symbol: str
    speciesid: int
    common_name: str


class GeneInfo(GeneInfoBase):
    genus:str
    species:str
    locus_tag: str
    species_specific_geneid: str
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
    homolog_type: str
    
    class Config:
        orm_mode = True


# Gene Neighborhood Edges
class GeneNeighborEdgesBase(BaseModel):
    key: int


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
    description: str
    speciesid: int
    common_name: str
    genus: str
    species: str
    chromosome: str
    gene_type: str
       
    class Config:
        orm_mode = True


class GeneNeighborNodes(GeneNeighborNodesBase):
    attributes: GeneNeighborNodesAttr | None = None
    
    class Config:
        orm_mode = True


# Multigene Post Request format
class GeneList(BaseModel):
    genes: list[int] | None = None


