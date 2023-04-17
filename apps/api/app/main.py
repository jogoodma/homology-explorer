from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Annotated

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


@app.get("/search/gene/symbol/{symbol}/", response_model=list[schemas.SymbolSearch])
def read_SymbolSearch(symbol: str, speciesid: int = None,
                      order_by_alpha: bool = True,
                      db: Session = Depends(get_db), 
                      skip: int = 0, limit: int = 20):
    
    db_symbol = crud.get_SymbolSearch(
        db=db, symbol=symbol, speciesid=speciesid,
        order_by_alpha=order_by_alpha,
        skip=skip, limit=limit
    )
    
    if db_symbol is None:
        raise HTTPException(status_code=404, detail="Symbol not found")
    
    return db_symbol


@app.get("/geneinfo/gene/{gene_id}/", response_model=schemas.GeneInfo)
def read_GeneInfo(gene_id: int, db: Session = Depends(get_db)):
    
    db_gene = crud.get_GeneInfo(db=db, gene_id=gene_id)
    
    if db_gene is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    
    return db_gene


@app.post("/geneinfo/multigene/", response_model=list[schemas.GeneInfo])
def read_MultiGeneInfo(genelist: schemas.GeneList, 
                       db: Session = Depends(get_db),
                       skip: int = 0, limit: int = 10000):

    db_genes = crud.get_MultiGeneInfo(
        db=db, genelist=genelist, skip=skip, limit=limit
    )

    if db_genes is None:
        raise HTTPException(status_code=404, detail="Genes not found")
    
    return db_genes


@app.get("/orthologpairs/gene/{gene_id}/", response_model=list[schemas.OrthologPairs])
def read_OrthologPairs(gene_id: int, db: Session = Depends(get_db), 
                       skip: int = 0, limit: int = 10000):
    
    db_pairs = crud.get_OrthologPairs(db=db, gene_id=gene_id, skip=skip, limit=limit)
    
    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    
    return db_pairs


@app.post("/orthologpairs/multigene/", response_model=list[schemas.OrthologPairs])
def read_MultiOrthologPairs(genelist: schemas.GeneList,
                            db: Session = Depends(get_db), 
                            skip: int = 0, limit: int = 10000):
    
    db_pairs = crud.get_MultiOrthologPairs(
        db=db, genelist=genelist, skip=skip, limit=limit
    )
    
    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Genes not found")
    
    return db_pairs


@app.get("/geneneighboredges/gene/{gene_id}/", response_model=list[schemas.GeneNeighborEdges])
def read_GeneNeighborEdges(gene_id: int, weight_lb: int = None, weight_ub: int = None, 
                           db: Session = Depends(get_db)):
    
    db_neighbors = crud.get_GeneNeighborhood(
        db=db, gene_id=gene_id, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighboredges = crud.get_GeneNeighborEdges(
        db=db, neighbors=db_neighbors
    )
    
    if db_neighboredges is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    
    return db_neighboredges


@app.post("/geneneighboredges/multigene/", response_model=list[schemas.GeneNeighborEdges])
def read_MultiGeneNeighborEdges(genelist: schemas.GeneList,
                                weight_lb: int = None, weight_ub: int = None, 
                                db: Session = Depends(get_db)):
    
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, 
        weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighboredges = crud.get_GeneNeighborEdges(
        db=db, neighbors=db_neighbors
    )
    
    if db_neighboredges is None:
        raise HTTPException(status_code=404, detail="Genes not found")
    
    return db_neighboredges


@app.get("/geneneighbornodes/gene/{gene_id}/", response_model=list[schemas.GeneNeighborNodes])
def read_GeneNeighborNodes(gene_id: int, weight_lb: int = None, weight_ub: int = None, 
                           db: Session = Depends(get_db)):
 
    db_neighbors = crud.get_GeneNeighborhood(
        db=db, gene_id=gene_id, weight_lb=weight_lb, weight_ub=weight_ub
    )    
    db_neighbornodes = crud.get_GeneNeighborNodes(
        db=db, neighbors=db_neighbors
    )
    
    if db_neighbornodes is None:
        raise HTTPException(status_code=404, detail="Gene not found")
    
    return db_neighbornodes


@app.post("/geneneighbornodes/multigene/", response_model=list[schemas.GeneNeighborNodes])
def read_MultiGeneNeighborNodes(genelist: schemas.GeneList,
                                weight_lb: int = None, weight_ub: int = None, 
                                db: Session = Depends(get_db)):
     
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, 
        weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighbornodes = crud.get_GeneNeighborNodes(
        db=db, neighbors=db_neighbors
    )
    
    if db_neighbornodes is None:
        raise HTTPException(status_code=404, detail="Genes not found")
    
    return db_neighbornodes


@app.post("/geneneighbornodelink/multigene/", response_model=schemas.GeneNeighborNodeLink)
def read_MultiGeneNeighborNodeLink(genelist: schemas.GeneList,
                                   weight_lb: int = None, weight_ub: int = None, 
                                   db: Session = Depends(get_db)):
     
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, 
        weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighbornodelist = crud.get_GeneNeighborNodelist(
        db=db, neighbors=db_neighbors
    )
    db_neighboredgelist = crud.get_GeneNeighborEdgelist(
        db=db, neighbors=db_neighbors
    )

    result = dict()
    result['nodes'] = db_neighbornodelist
    result['links'] = db_neighboredgelist

    if db_neighbornodelist is None:
        raise HTTPException(status_code=404, detail="Genes not found")
    
    if db_neighboredgelist is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    print(type(result))
    print(type(result['nodes']))
    print(type(result['links']))
    
    from pprint import pprint
    pprint(result['nodes'])
    pprint(result['links'])

    return result


