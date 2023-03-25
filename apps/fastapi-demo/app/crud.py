from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import label

from . import models, schemas

### Original Gene and Orthology Info ###

def get_GeneInfo(db: Session, gene_id: int):
    
    return db.query(models.GeneInfo)\
             .filter(models.GeneInfo.geneid == gene_id)\
             .first()


def get_OrthologPairs(db: Session, gene_id: int, skip: int = 0, limit: int = 1000000):
   
    return db.query(models.OrthologPairs)\
             .filter(
                 (models.OrthologPairs.geneid1 == gene_id) | 
                 (models.OrthologPairs.geneid2 == gene_id)
             ).offset(skip).limit(limit).all()


### Gene Neighbor Info ###

def get_GeneNeighborhood(db: Session, gene_id: int):
    gid = db.query(models.OrthologPairs.geneid1, models.OrthologPairs.geneid2)\
            .filter(
                 (models.OrthologPairs.geneid1 == gene_id) | 
                 (models.OrthologPairs.geneid2 == gene_id)
            ).distinct().all()
    
    return list(set([i for (i,j) in gid]+[j for (i,j) in gid]))


def get_GeneNeighborEdges(db: Session, neighbors: list):   
    
    return db.query(models.GeneNeighborEdges)\
             .filter(
                 (models.GeneNeighborEdges.source.in_(neighbors)) & 
                 (models.GeneNeighborEdges.target.in_(neighbors))
             ).all()


def get_GeneNeighborNodes(db: Session, neighbors: list):
   
    return db.query(models.GeneNeighborNodes)\
             .filter((models.GeneNeighborNodes.key.in_(neighbors)))\
             .all()


