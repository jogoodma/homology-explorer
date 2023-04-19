# homology-explorer

A tool for exploring orthology and paraology relationships in model organism species.

## Getting Started

## Development

### Requirements

This repository uses `docker compose up` to build the homology explorer app. There are four containers of the application:

+ API: Python `FastAPI` with `Networkx` via `poetry`
+ NGINX server
+ Duck Database volume
+ UI: Typescript/JS Node `Turbo` + `Vite` + `Graphology` via `pnpm`

The services are run through their respective `Dockerfiles`.

Additionall, the dataparser directory contains the `dbBuiler.py` script to create the appropriate `duck.db` from the source data. Source data provided by DIOPT can be extracted from the `diopt_data.tar.gz` file. 

