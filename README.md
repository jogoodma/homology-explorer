# homology-explorer

A tool for exploring orthology and paraology relationships in model organism species.

## Getting Started



## Development

### Requirements

- pandoc
- tex
- node
- pnpm

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
