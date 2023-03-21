import duckdb

### Initialize db connection
# con = duckdb.connect(database='duck.db')
con = duckdb.connect(database=':memory:')

### build db from .tsv sourcefiles
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
