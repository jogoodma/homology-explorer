from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/GeneInfo/{gene_id}", response_model=schemas.GeneInfo)
def read_GeneInfo(gene_id: int, db: Session = Depends(get_db)):
    db_gene = crud.get_GeneInfo(db, gene_id=gene_id)
    if db_gene is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_gene


@app.get("/OrthologPairs/{gene_id}/", response_model=list[schemas.OrthologPairs])
def read_OrthologPairs(gene_id: int, db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    db_pairs = crud.get_OrthologPairs(db=db, gene_id=gene_id, skip=skip, limit=limit)
    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_pairs


@app.get("/GeneNeighborhood/{gene_id}/", response_model=list[schemas.OrthologPairs])
def read_GeneNeighborhood(gene_id: int, db: Session = Depends(get_db)):
    db_neighborhood = crud.get_GeneNeighborhood(db=db, gene_id=gene_id)
    if db_neighborhood is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_neighborhood

