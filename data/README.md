The `dbBuilder.py` uses the `duckdb` library to read-in the homology `.tsv` data (as originally provided by [DIOPT](https://www.flyrnai.org/diopt)) and converts it into a `duck.db` file. To access these `.tsv` files, `cd` to this directory and execute `tar -xvf homologydata.tar.xz`. 

To execute, use the following commands in your shell terminal at the `../homology-explorer/data/` directory:

`poetry shell`

`poetry run python dbBuilder.py`

Example Path for `/data` after data decompression:

```markdown
data
├── dbBuilder.py
├── duck.db
├── erd.md
├── Gene_Information.tsv
├── homologydata.tar.xz
├── Ortholog_Pair_Best.tsv
├── Species.tsv
└── README.md
```
