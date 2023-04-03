import duckdb

### Initialize db connection
con = duckdb.connect(database='duck.db')
#con = duckdb.connect(database=':memory:')

### TABLES ###

# build db from .tsv sourcefiles

#tblSpecies
con.execute(
    """
    DROP TABLE IF EXISTS tblSpecies;
    CREATE TABLE tblSpecies AS 
        SELECT * FROM read_csv(
            'Species.tsv', delim='\t',
            header=True, AUTO_DETECT=TRUE
        );
    """
)

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

#evwGeneFrequency
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneFrequency;
    CREATE VIEW evwGeneFrequency AS 
       SELECT 
        geneid1 AS 'geneid'
        , COUNT(*) AS 'frequency' 
       FROM tblOrthologPairs
       GROUP BY geneid1;
    """
)

#evwSymbolSearch
con.execute(
    """
    DROP VIEW IF EXISTS evwSymbolSearch;
    CREATE VIEW evwSymbolSearch AS 
        SELECT 
            a.geneid
            , a.symbol
            , a.speciesid
            , b.common_name
            , c.frequency
        FROM tblGeneInfo a
        LEFT JOIN tblSpecies b
            ON a.speciesid = b.taxonomyid
        LEFT JOIN evwGeneFrequency c
            ON a.geneid = c.geneid;
    """
)

#evwGeneInfo
con.execute(
    """
    DROP VIEW IF EXISTS evwGeneInfo;
    CREATE VIEW evwGeneInfo AS 
        SELECT 
            a.geneid
            , a.symbol
            , a.description
            , a.speciesid
            , b.common_name
            , b.genus
            , b.species
            , a.locus_tag
            , a.species_specific_geneid
            , a.species_specific_geneid_type
            , a.chromosome
            , a.map_location
            , a.gene_type
        FROM tblGeneInfo a
        LEFT JOIN tblSpecies b
            ON a.speciesid = b.taxonomyid;
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
            a.geneid AS 'key'
            , a.symbol
            , a.description
            , a.speciesid
            , b.common_name
            , b.genus
            , b.species
            , a.chromosome
            , a.gene_type
        FROM tblGeneInfo a
        LEFT JOIN tblSpecies b
            ON a.speciesid = b.taxonomyid;
    """
)

