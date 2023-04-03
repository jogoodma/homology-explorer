#!/usr/bin/env python3
from pathlib import Path
import polars as pl


TAXID= 9606
gene_info_file = Path("data", "Gene_Information.tsv")
human_gene_info_json = Path("data", "human_gene_info.json")

type_overrides = {
    'species_specific_geneid': pl.Utf8
}
human_df = pl.scan_csv(gene_info_file, has_header=True, separator="\t", dtypes=type_overrides).filter(pl.col('speciesid') == TAXID).collect()
human_df.write_json(human_gene_info_json, row_oriented=True)

