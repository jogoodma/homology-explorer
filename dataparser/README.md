The `dbBuilder.py` uses the `duckdb` library to read-in the homology `.tsv` data (as originally provided by DIOPT) and converts it into a `duck.db` file.

The `OrthologPairs.tsv` and `Gene_Information.tsv` files can be extracted by running:

`tar -xzvf diopt_data.tar.gz`

To execute `dbBuilder.py` and create the database, use the following commands in your shell terminal at the `../homology-explorer/dataparser/` directory:

`poetry shell`

`poetry run python dbBuilder.py`

Example Path for `/data` after extracting tar file and building db:

```markdown
data
├── dbBuilder.py
├── duck.db
├── Gene_Information.tsv
├── Ortholog_Pair_Best.tsv
├── Species.tsv
├── poetry.lock
├── pyproject.toml
└── README.md

```
