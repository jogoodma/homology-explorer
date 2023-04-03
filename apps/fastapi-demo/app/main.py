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


@app.get("/search/gene/symbol/{symbol}", response_model=list[schemas.SymbolSearchBase])
def read_SymbolSearch(symbol: str, db: Session = Depends(get_db), skip: int = 0, limit: int = 20):
    db_symbol = crud.get_SymbolSearch(db, symbol=symbol, skip=skip, limit=limit)
    if db_symbol is None:
        raise HTTPException(status_code=404, detail="Symbol not found")
    return db_symbol


@app.get("/GeneInfo/{gene_id}", response_model=schemas.GeneInfo)
def read_GeneInfo(gene_id: int, db: Session = Depends(get_db)):
    db_gene = crud.get_GeneInfo(db, gene_id=gene_id)
    if db_gene is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_gene


@app.get("/OrthologPairs/{gene_id}/", response_model=list[schemas.OrthologPairs])
def read_OrthologPairs(gene_id: int, db: Session = Depends(get_db), skip: int = 0, limit: int = 10000):
    db_pairs = crud.get_OrthologPairs(db=db, gene_id=gene_id, skip=skip, limit=limit)
    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_pairs


@app.get("/GeneNeighborEdges/{gene_id}/", response_model=list[schemas.GeneNeighborEdges])
def read_GeneNeighborEdges(gene_id: int, db: Session = Depends(get_db)):
    db_neighbors = crud.get_GeneNeighborhood(db=db, gene_id=gene_id)
    db_neighboredges = crud.get_GeneNeighborEdges(db=db, neighbors=db_neighbors)
    if db_neighboredges is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_neighboredges


@app.get("/GeneNeighborNodes/{gene_id}/", response_model=list[schemas.GeneNeighborNodes])
def read_GeneNeighborNodes(gene_id: int, db: Session = Depends(get_db)):
    db_neighbors = crud.get_GeneNeighborhood(db=db, gene_id=gene_id)
    db_neighbornodes = crud.get_GeneNeighborNodes(db=db, neighbors=db_neighbors)
    if db_neighbornodes is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    return db_neighbornodes


