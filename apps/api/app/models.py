from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


### Basic Gene and Orthology Info ###

class SymbolSearch(Base):
    __tablename__ = "evwSymbolSearch"
    
    geneid = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    speciesid = Column(Integer)
    common_name = Column(String)
    frequency = Column(Integer)


class GeneInfo(Base):
    __tablename__ = "evwGeneInfo"
    
    geneid = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    description = Column(String)
    speciesid = Column(Integer)
    common_name = Column(String)
    genus = Column(String)
    species = Column(String) 
    locus_tag = Column(String)
    species_specific_geneid = Column(Integer)
    species_specific_geneid_type = Column(String)
    chromosome = Column(String)
    map_location = Column(String)
    gene_type = Column(String)


class OrthologPairs(Base):
    __tablename__ = "tblOrthologPairs"
    
    opb_id = Column(Integer, primary_key=True, index=True)
    species1 = Column(Integer)
    geneid1 = Column(Integer)
    species2 = Column(Integer)
    geneid2 = Column(Integer)
    weight = Column(Integer)
    best_score = Column(String)
    best_score_rev = Column(String)
    confidence = Column(String)


### Gene Neighbor Info ###

class GeneNeighborEdgelist(Base):
    __tablename__ = "evwGeneNeighborEdgelist"
    
    source = Column(Integer, primary_key=True)
    target = Column(Integer, primary_key=True)
    value = Column(Integer, primary_key=True)


class GeneNeighborEdges(Base):
    __tablename__ = "evwGeneNeighborEdges"
    
    key = Column(Integer, primary_key=True, index=True)
    source = Column(Integer)
    target = Column(Integer)
    
    attributes = relationship(
        "GeneNeighborEdgesAttr", 
        back_populates="link",
        uselist=False
    )
  

class GeneNeighborEdgesAttr(Base):
    __tablename__ = "evwGeneNeighborEdgesAttr"
    
    key = Column(Integer, ForeignKey("evwGeneNeighborEdges.key"), primary_key=True)
    weight = Column(Integer)
    
    link = relationship(
        "GeneNeighborEdges", 
        back_populates="attributes",
        uselist=False
    )


class GeneNeighborNodes(Base):
    __tablename__ = "evwGeneNeighborNodes"
    
    key = Column(Integer, primary_key=True, index=True)
    
    attributes = relationship(
        "GeneNeighborNodesAttr", 
        back_populates="node", 
        uselist=False
    )


class GeneNeighborNodesAttr(Base):
    __tablename__ = "evwGeneNeighborNodesAttr"
    
    key = Column(Integer, ForeignKey("evwGeneNeighborNodes.key"), primary_key=True)
    symbol = Column(String)
    description = Column(String)
    speciesid = Column(Integer)
    common_name = Column(String)
    genus = Column(String)
    species = Column(String)  
    chromosome = Column(String)
    gene_type = Column(String)
    
    node = relationship(
        "GeneNeighborNodes", 
        back_populates="attributes", 
        uselist=False
    )


