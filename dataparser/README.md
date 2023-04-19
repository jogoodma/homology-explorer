The `dbBuilder.py` uses the `duckdb` library to read-in the homology `.tsv` data (as originally provided by DIOPT) and converts it into a `duck.db` file.

To execute, use the following commands in your shell terminal at the `../homology-explorer/data/` directory:

`poetry shell`

`poetry run python dbBuilder.py`

Example Path for `/data`:

```markdown
data
├── dbBuilder.py
├── duck.db
├── Gene_Information.tsv
├── Ortholog_Pair_Best.tsv
├── Species.tsv
└── README.md

```
