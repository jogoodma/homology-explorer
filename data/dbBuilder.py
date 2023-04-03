import duckdb

### Initialize db connection
con = duckdb.connect(database='duck.db')
#con = duckdb.connect(database=':memory:')

### build db from .tsv sourcefiles

### TABLES ###

# tblGeneInfo
con.execute(
    """
    DROP TABLE IF EXISTS tblGeneInfo;
    CREATE TABLE tblGeneInfo AS 
        SELECT * FROM read_csv(
            'Gene_Information.tsv', delim='\t', 
            header=True, AUTO_DETECT=TRUE
        );
    """
)

#tblOrthologPairs
con.execute(
    """
    DROP TABLE IF EXISTS tblOrthologPairs;
    CREATE TABLE tblOrthologPairs AS 
        SELECT * FROM read_csv(
            'Ortholog_Pair_Best.tsv', delim='\t', 
            header=True, AUTO_DETECT=TRUE
        );
    ALTER TABLE tblOrthologPairs
    RENAME COLUMN score TO weight;
    """
)

### VIEWS ###

#evwSymbolSearch
con.execute(
    """
    DROP VIEW IF EXISTS evwSymbolSearch;
    CREATE VIEW evwSymbolSearch AS 
        SELECT geneid, speciesid, symbol
        FROM tblGeneInfo;
    """
)

#evwGeneNeighborEdges
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneNeighborEdges;
    CREATE VIEW evwGeneNeighborEdges AS 
        SELECT
            opb_id AS 'key'
            , geneid1 AS 'source'
            , geneid2 AS 'target'
        FROM tblOrthologPairs
        WHERE best_score='Yes';
    """
)

#evwGeneNeighborEdgesAttr
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneNeighborEdgesAttr;
    CREATE VIEW evwGeneNeighborEdgesAttr AS 
        SELECT
            opb_id AS 'key'
            , weight
        FROM tblOrthologPairs
        WHERE best_score='Yes';
    """
)

#evwGeneNeighborNodes
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneNeighborNodes;
    CREATE VIEW evwGeneNeighborNodes AS 
        SELECT
            geneid AS 'key'
        FROM tblGeneInfo
    """
)

#evwGeneNeighborNodesAttr
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneNeighborNodesAttr;
    CREATE VIEW evwGeneNeighborNodesAttr AS 
        SELECT
            geneid AS 'key'
            , symbol
            , speciesid
            , description
            , chromosome
            , gene_type
        FROM tblGeneInfo
    """
)

