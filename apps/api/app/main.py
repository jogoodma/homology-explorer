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


### GET calls ###


@app.get("/search/gene/symbol/{symbol}/", response_model=list[schemas.SymbolSearch])
def read_SymbolSearch(
    symbol: str,
    speciesid: int = None,
    order_by_alpha: bool = True,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
):
    db_symbol = crud.get_SymbolSearch(
        db=db,
        symbol=symbol,
        speciesid=speciesid,
        order_by_alpha=order_by_alpha,
        skip=skip,
        limit=limit,
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


@app.get("/orthologpairs/gene/{gene_id}/", response_model=list[schemas.OrthologPairs])
def read_OrthologPairs(
    gene_id: int, db: Session = Depends(get_db), skip: int = 0, limit: int = 10000
):
    db_pairs = crud.get_OrthologPairs(db=db, gene_id=gene_id, skip=skip, limit=limit)

    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Gene not found")

    return db_pairs


@app.get(
    "/geneneighboredges/gene/{gene_id}/", response_model=list[schemas.GeneNeighborEdges]
)
def read_GeneNeighborEdges(
    gene_id: int,
    weight_lb: int = None,
    weight_ub: int = None,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_GeneNeighborhood(
        db=db, gene_id=gene_id, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighboredges = crud.get_GeneNeighborEdges(db=db, neighbors=db_neighbors)

    if db_neighboredges is None:
        raise HTTPException(status_code=404, detail="Gene not found")

    return db_neighboredges


@app.get(
    "/geneneighbornodes/gene/{gene_id}/", response_model=list[schemas.GeneNeighborNodes]
)
def read_GeneNeighborNodes(
    gene_id: int,
    weight_lb: int = None,
    weight_ub: int = None,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_GeneNeighborhood(
        db=db, gene_id=gene_id, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighbornodes = crud.get_GeneNeighborNodes(db=db, neighbors=db_neighbors)

    if db_neighbornodes is None:
        raise HTTPException(status_code=404, detail="Gene not found")

    return db_neighbornodes


### POST calls ###


@app.post("/geneinfo/multigene/", response_model=list[schemas.GeneInfo])
def read_MultiGeneInfo(
    genelist: schemas.GeneList,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10000,
):
    db_genes = crud.get_MultiGeneInfo(db=db, genelist=genelist, skip=skip, limit=limit)

    if db_genes is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_genes


@app.post("/orthologpairs/multigene/", response_model=list[schemas.OrthologPairs])
def read_MultiOrthologPairs(
    genelist: schemas.GeneList,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10000,
):
    db_pairs = crud.get_MultiOrthologPairs(
        db=db, genelist=genelist, skip=skip, limit=limit
    )

    if db_pairs is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_pairs


@app.post(
    "/geneneighboredges/multigene/", response_model=list[schemas.GeneNeighborEdges]
)
def read_MultiGeneNeighborEdges(
    genelist: schemas.GeneList,
    weight_lb: int = None,
    weight_ub: int = None,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighboredges = crud.get_GeneNeighborEdges(db=db, neighbors=db_neighbors)

    if db_neighboredges is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_neighboredges


@app.post("/geneneighboredges/multigene/{analysis}")
def read_MultiGeneNeighborEdgeAnalysis(
    genelist: schemas.GeneList,
    analysis: str,
    weight_lb: int = None,
    weight_ub: int = None,
    threshold: float = 0.5,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_analysis = crud.get_GeneNeighborEdgeInfo(db=db, neighbors=db_neighbors)
    db_edgelist = crud.get_GeneNeighborEdgelist(db=db, neighbors=db_neighbors)

    if analysis == "linkcom":
        db_newedgeattr = crud.get_Linkcom(
            db=db, edgelist=db_edgelist, threshold=threshold
        )
        db_analysis = crud.add_EdgeAnalysis(
            db=db, edgeattrs=db_analysis, newedgeattr=db_newedgeattr
        )

    if analysis not in ["linkcom"]:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if db_neighbors is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_analysis


@app.post(
    "/geneneighbornodes/multigene/", response_model=list[schemas.GeneNeighborNodes]
)
def read_MultiGeneNeighborNodes(
    genelist: schemas.GeneList,
    weight_lb: int = None,
    weight_ub: int = None,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_neighbornodes = crud.get_GeneNeighborNodes(db=db, neighbors=db_neighbors)

    if db_neighbornodes is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_neighbornodes


@app.post("/geneneighbornodes/multigene/{analysis}")
def read_MultiGeneNeighborNodeAnalysis(
    genelist: schemas.GeneList,
    analysis: str,
    weight_lb: int = None,
    weight_ub: int = None,
    alpha: float = 0.85,
    db: Session = Depends(get_db),
):
    db_neighbors = crud.get_MultiGeneNeighborhood(
        db=db, genelist=genelist, weight_lb=weight_lb, weight_ub=weight_ub
    )
    db_analysis = crud.get_GeneNeighborNodeInfo(db=db, neighbors=db_neighbors)
    db_edgelist = crud.get_GeneNeighborEdgelist(db=db, neighbors=db_neighbors)

    if analysis == "pagerank":
        db_newnodeattr = crud.get_Pagerank(db=db, edgelist=db_edgelist, alpha=alpha)
        db_analysis = crud.add_NodeAnalysis(
            db=db, nodeattrs=db_analysis, newnodeattr=db_newnodeattr
        )

    if analysis not in ["pagerank"]:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if db_neighbors is None:
        raise HTTPException(status_code=404, detail="Genes not found")

    return db_analysis
