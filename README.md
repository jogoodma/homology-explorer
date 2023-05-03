# homology-explorer

A tool for exploring orthology and paralogy relationships in model organism species.

[Demonstration Video](https://youtu.be/I-Q6B78EzIA)

## Getting Started

## Development

### Base Requirements

- pandoc
- tex
- node
- pnpm
- python
- poetry

Note: This repository uses pnpm to manage javascript dependencies. Using npm or yarn may cause
issues due to the lock files not being used.

### Setup

```shell
git clone git@github.com:jogoodma/homology-explorer.git
cd homology-explorer
pnpm install
```

### PDF Generation

This package uses `pandoc`, `tex`, and `mermaid-filter` to generate PDF documentation from
markdown files. To generate a PDF first install `pandoc` and `tex` via your OS installer
of choice then do the following.

1. Clone the repo (if you have not already)
2. Change to repo directory
3. Install `mermaid-filter`
4. Run the command to generate a PDF

```shell
git clone git@github.com:jogoodma/homology-explorer.git
cd homology-explorer
pnpm install
pnpm run [DOCUMENT SCRIPT TARGET]
```

Replace `[DOCUMENT SCRIPT TARGET]` with one of the available commands listed under `scripts` in the
`package.json` file.

e.g.

```shell
pnpm run pandoc:proposal
```

### Docker

*Requirements*:
 * Docker
 * Docker compose
 * DIOPT data files (in the `data` directory):
   * `Gene_Information.tsv`
   * `Ortholog_Pair_Best.tsv`
   * `Species.tsv`

To run a production build in Docker use the following commands. 
```shell
docker volume create he_caddy_data
docker compose up -d --build
```
The volume command is only required one time.
This will build the database, the API server, the UI, and start a production server on port 8000.
To change the port set the `HOMOLOGY_EXPLORER_PORT` environment
variable.

e.g.
```shell
echo "HOMOLOGY_EXPLORER_PORT=8888" >> .env
```

#### Docker container overview
```mermaid
flowchart LR
    user(User) == "port 8000" ==> proxy(Caddy Server)
    subgraph docker[Docker]
        proxy == "/api/* on port 80" ==> api(FastAPI)
        proxy == "port 4173" ==> UI(React App)
        subgraph d1[Proxy service]
            proxy
        end
        subgraph d2[UI service]
            UI
        end
        subgraph d3[API service]
            api ==> database[(DuckDB)]
        end
    end
```
