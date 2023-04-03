from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import label
from sqlalchemy import nullslast

from . import models, schemas

### Original Gene and Orthology Info ###

def get_SymbolSearch(db: Session, symbol: str, 
                     speciesid: int | None = None,
                     order_by_frequency: bool = True, 
                     skip: int = 0, limit: int = 20): 
    
    q = db.query(models.SymbolSearch)\
          .filter((models.SymbolSearch.symbol.like(f"%{symbol}%")))    

    if speciesid is not None:
        q = q.filter((models.SymbolSearch.speciesid == speciesid))

    if order_by_frequency:
        q = q.order_by((models.SymbolSearch.frequency.desc().nullslast()))
        
    return q.offset(skip).limit(limit).all()


def get_GeneInfo(db: Session, gene_id: int):
    
    return db.query(models.GeneInfo)\
             .filter(models.GeneInfo.geneid == gene_id)\
             .first()


def get_OrthologPairs(db: Session, gene_id: int, 
                      skip: int = 0, limit: int = 1000000):
   
    return db.query(models.OrthologPairs)\
             .filter(
                 (models.OrthologPairs.geneid1 == gene_id) | 
                 (models.OrthologPairs.geneid2 == gene_id)
             ).offset(skip).limit(limit).all()


### Gene Neighbor Info ###

def get_GeneNeighborhood(db: Session, gene_id: int, 
                         speciesid: int | None = None,
                         strict: bool = True,
                         weight_lb: int | None = None,
                         weight_ub: int | None = None):
    
    q = db.query(models.OrthologPairs.geneid1, models.OrthologPairs.geneid2)\
          .filter(
              (models.OrthologPairs.geneid1 == gene_id) | 
              (models.OrthologPairs.geneid2 == gene_id)
          ).distinct()
    
    if strict:
        if speciesid is not None:
            q = q.filter(
                (models.OrthologPairs.species1 == speciesid) &
                (models.OrthologPairs.species2 == speciesid)
            )
    else:
        if speciesid is not None:
            q = q.filter(
                (models.OrthologPairs.species1 == speciesid) |
                (models.OrthologPairs.species2 == speciesid)
            )
    
    if weight_lb is not None:
        q = q.filter((models.OrthologPairs.weight) >= weight_lb)
 
    if weight_ub is not None:
        q = q.filter((models.OrthologPairs.weight) <= weight_ub)
    
    q = q.all()
    
    result = list(set([i for (i,j) in q]+[j for (i,j) in q]))

    return result


def get_GeneNeighborEdges(db: Session, neighbors: list):   
    
    q = db.query(models.GeneNeighborEdges)\
          .filter(
              (models.GeneNeighborEdges.source.in_(neighbors)) & 
              (models.GeneNeighborEdges.target.in_(neighbors))
          )
     
    return q.all()


def get_GeneNeighborNodes(db: Session, neighbors: list):
   
    return db.query(models.GeneNeighborNodes)\
             .filter((models.GeneNeighborNodes.key.in_(neighbors)))\
             .all()


