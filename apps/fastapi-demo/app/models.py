from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class GeneInfo(Base):
    __tablename__ = "tblGeneInfo"

    geneid = Column(Integer, primary_key=True, index=True)
    speciesid = Column(Integer)
    symbol = Column(String)
    description = Column(String)
    locus_tag = Column(String)
    species_specific_geneid = Column(Integer)
    species_specific_geneid_type = Column(String)
    chromosome = Column(String)
    map_location = Column(String)
    gene_type = Column(String)

    #edges = relationship("OrthologPairs", back_populates="nodes")


class OrthologPairs(Base):
    __tablename__ = "tblOrthologPairs"

    opb_id = Column(Integer, primary_key=True, index=True)
    species1 = Column(Integer)
    geneid1 = Column(Integer)#, ForeignKey("tblGeneInfo.geneid"))
    species2 = Column(Integer)
    geneid2  = Column(Integer)#, ForeignKey("tblGeneInfo.geneid"))
    weight = Column(Integer)
    best_score = Column(String)
    best_score_rev = Column(String)
    confidence = Column(String)

    #nodes = relationship("GeneInfo", back_populates="edges")


