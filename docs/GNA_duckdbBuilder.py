## Script to build duck.db for GeneNeighborhood.ipynb
import duckdb

## Initialize db connection
con = duckdb.connect(database='duck.db')

## build db from .tsv sourcefiles
con.execute(
    """
    DROP TABLE IF EXISTS tblGeneInfo;
    CREATE TABLE tblGeneInfo AS 
        SELECT * FROM read_csv(
            '../data/Gene_Information.tsv', delim='\t', 
            header=True, AUTO_DETECT=TRUE
        );
    """
)
## NOTE: this script should be run in a terminal, may crash Jupyter...
con.execute(
    """
    DROP TABLE IF EXISTS tblOrthologPairs;
    CREATE TABLE tblOrthologPairs AS 
        SELECT * FROM read_csv(
            '../data/Ortholog_Pair_Best.tsv', delim='\t', 
            header=True, AUTO_DETECT=TRUE
        );
    ALTER TABLE tblOrthologPairs
    RENAME COLUMN score TO weight;
    """
)

con.close()
