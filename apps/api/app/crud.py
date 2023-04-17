import networkx as nx
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import label
from sqlalchemy import nullslast

from . import models, schemas

### Gene and Orthology Info ###

def get_SymbolSearch(db: Session, symbol: str, 
                     speciesid: int | None = None,
                     order_by_alpha: bool = True, 
                     skip: int = 0, limit: int = 20): 
    
    q = db.query(models.SymbolSearch)\
          .filter((models.SymbolSearch.symbol.ilike(f"%{symbol}%")))    
    
    if speciesid is not None:
        q = q.filter((models.SymbolSearch.speciesid == speciesid))
    
    if order_by_alpha:
        q = q.order_by((models.SymbolSearch.symbol))
        
    q = q.offset(skip).limit(limit)
    
    return q.all()


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
                         weight_lb: int | None = None,
                         weight_ub: int | None = None):
    
    q = db.query(
              models.OrthologPairs.geneid1, 
              models.OrthologPairs.geneid2
          ).filter(
              (models.OrthologPairs.geneid1 == gene_id) | 
              (models.OrthologPairs.geneid2 == gene_id)
          ).distinct()
    
    if weight_lb is not None:
        q = q.filter((models.OrthologPairs.weight) >= weight_lb)
    
    if weight_ub is not None:
        q = q.filter((models.OrthologPairs.weight) <= weight_ub)
    
    q = q.all()
    
    result = list(set([i for (i,j) in q]+[j for (i,j) in q]))
    
    return result


def get_GeneNeighborNodes(db: Session, neighbors: list):
       
    return db.query(models.GeneNeighborNodes)\
             .filter((models.GeneNeighborNodes.key.in_(neighbors)))\
             .all()


def get_GeneNeighborNodeInfo(db: Session, neighbors: list):
       
    return db.query(models.GeneInfo)\
             .filter((models.GeneInfo.geneid.in_(neighbors)))\
             .all()


def get_GeneNeighborEdges(db: Session, neighbors: list):   
    
    q = db.query(models.GeneNeighborEdges)\
          .filter(
              (models.GeneNeighborEdges.source.in_(neighbors)) & 
              (models.GeneNeighborEdges.target.in_(neighbors))
          )
     
    return q.all()


def get_GeneNeighborEdgelist(db:Session, neighbors: list):
    
    edges = db.query(models.GeneNeighborEdgelist)\
              .filter(
                  (models.GeneNeighborEdgelist.source.in_(neighbors)) & 
                  (models.GeneNeighborEdgelist.target.in_(neighbors))
              ).all()
    
    edgevars = [ vars(e) for e in edges ]
    
    for ev in edgevars:
        ev['attributes'] = { 'weight': ev['value'] }
        ev.pop('value')
        ev.pop('_sa_instance_state')
      
    edgelist = [ tuple(e.values()) for e in edgevars ]
    
    return edgelist


### Network Analysis ###

def get_Pagerank(db: Session, edgelist: list, alpha: float):
     
    g = nx.DiGraph()
    g.add_edges_from(edgelist)
    
    pagerank = nx.pagerank(g, alpha=alpha, weight='weight')
    
    newnodeattr = [
        { 'key':key,'attributes':{'pagerank':value} }
        for key, value in pagerank.items()
    ]
    
    return newnodeattr


def add_NodeAnalysis(db: Session, nodeattrs: list, newnodeattr: list):
    
    nodevars = [ vars(node) for node in nodeattrs ]
    
    nodeattrlist = [
        {
            'key': n['geneid'], 
            'attributes': {
                'symbol': n['symbol'],
                'description': n['description'],
                'speciesid': n['speciesid'],
                'common_name': n['common_name'],
                'genus': n['genus'],
                'species': n['chromosome'],
                'gene_type': n['gene_type']
            }
        } for n in nodevars 
    ]
     
    newnodelist = []
    for node in nodeattrlist:
        for new in newnodeattr:
            if node['key'] == new['key']:
                attributes = { **node['attributes'], **new['attributes'] }
                newnode = { 'key':node['key'], 'attributes':attributes }
                newnodelist.append(newnode)
    
    print(newnodelist)
    
    return newnodelist


### Multigene Queries ###

def get_MultiGeneInfo(db: Session, genelist: list, 
                      skip: int = 0, limit: int = 1000000):
    
    return db.query(models.GeneInfo)\
             .filter(
                 (models.GeneInfo.geneid.in_(genelist.genes))
             ).offset(skip).limit(limit).all()


def get_MultiOrthologPairs(db: Session, genelist: list, 
                           skip: int = 0, limit: int = 1000000):
    
    return db.query(models.OrthologPairs)\
             .filter(
                 (models.OrthologPairs.geneid1.in_(genelist.genes)) | 
                 (models.OrthologPairs.geneid2.in_(genelist.genes))
             ).offset(skip).limit(limit).all()


def get_MultiGeneNeighborhood(db: Session, genelist: list, 
                              weight_lb: int | None = None,
                              weight_ub: int | None = None):
    
    q = db.query(
              models.OrthologPairs.geneid1, 
              models.OrthologPairs.geneid2
          ).filter(
              (models.OrthologPairs.geneid1.in_(genelist.genes)) | 
              (models.OrthologPairs.geneid2.in_(genelist.genes))
          ).distinct()
    
    if weight_lb is not None:
        q = q.filter((models.OrthologPairs.weight) >= weight_lb)
    
    if weight_ub is not None:
        q = q.filter((models.OrthologPairs.weight) <= weight_ub)
    
    q = q.all()
    
    result = list(set([i for (i,j) in q]+[j for (i,j) in q]))
    
    return result


