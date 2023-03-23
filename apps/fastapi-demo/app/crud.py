from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import label

from . import models, schemas


def get_GeneInfo(db: Session, gene_id: int):
    return db.query(models.GeneInfo)\
             .filter(models.GeneInfo.geneid == gene_id)\
             .first()


def get_OrthologPairs(db: Session, gene_id: int, skip: int = 0, limit: int = 1000000):
    return db.query(models.OrthologPairs)\
             .filter((models.OrthologPairs.geneid1 == gene_id) | (models.OrthologPairs.geneid2 == gene_id))\
             .offset(skip).limit(limit)\
             .all()


def get_GeneNeighborhood(db: Session, gene_id: int):
    gid1 = db.query(label('geneid',models.OrthologPairs.geneid1))\
             .filter(
                 (models.OrthologPairs.geneid1 == gene_id) |
                 (models.OrthologPairs.geneid2 == gene_id)
             ).distinct().all()

    gid2 = db.query(label('geneid',models.OrthologPairs.geneid2))\
             .filter(
                 (models.OrthologPairs.geneid1 == gene_id) | 
                 (models.OrthologPairs.geneid2 == gene_id)
             ).distinct().all()

    neighbors = [i for (i,) in gid1 + gid2]
    
    links =  db.query(models.OrthologPairs)\
               .filter(
                   (models.OrthologPairs.geneid1.in_(neighbors)) & 
                   (models.OrthologPairs.geneid2.in_(neighbors))
               ).all()
    
    #dlist = [i.__dict__ for i in links]
    #nodes = ["geneid1", "geneid2"]
    #edgelist = [
    #    [d[n] for n in nodes] + [{
    #        n:d[n] for n in d.keys() if n not in nodes+["_sa_instance_state"]
    #    }] for d in dlist
    #]

    return links

