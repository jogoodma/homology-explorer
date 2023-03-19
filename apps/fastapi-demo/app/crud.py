from sqlalchemy.orm import Session

from . import models, schemas


def get_GeneInfo(db: Session, gene_id: int):
    return db.query(models.GeneInfo)\
             .filter(models.GeneInfo.geneid == gene_id)\
             .first()


def get_OrthologPairs(db: Session, gene_id: int, skip: int=0, limit: int=100):
    return db.query(models.OrthologPairs)\
             .filter((models.OrthologPairs.geneid1 == gene_id) | (models.OrthologPairs.geneid2 == gene_id))\
             .offset(skip).limit(limit)\
             .all()


