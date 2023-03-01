# Homology Explorer Proposal

## Team members

* Josh Goodman
* Mark Green

## Abstract

## Introduction: why should we care?

## Related work


## Your approach and plan

**TODO: Temporary notes on ideas for this section**

- Data acquisition, processing, and analysis
  - Python 
- Creation of a data warehouse for storing graph information
  - NoSQL: DuckDB, SQLite, MongoDB, JSON 
  - SQL: PostgreSQL 
  - GraphDB: Dgraph, JanusGraph, or Neo4J
- Possible network analysis to add value to homology data
- Web application that is either pregenerated or fetches data from a "live" API to provide data
  exploration, filtering, and basic analysis
  - Web frameworks
    - [Astro](https://astro.build)
    - [Remix](https://remix.run)
  - Network visualization
    - [Cytoscape.js](https://js.cytoscape.org/)
    - [Sigma](https://sigmajs.org)
    - [Vega](https://vega.github.io/vega/)
    - 

### Potential data sources

- [DIOPT](https://www.flyrnai.org/diopt) - Meta orthologs and paralogs [^diopt]
- [Alliance of Genome Resources](https://www.alliancegenome.org/) - Various model organism data (functional, disease associations, etc.) [^alliance]


### Candidate methods to develop or apply


## References

[^alliance] Alliance of Genome Resources Consortium. Harmonizing model organism data in the Alliance of Genome Resources.
            Genetics. 2022 Apr 4;220(4):iyac022. doi: 10.1093/genetics/iyac022. PMID: 35380658; PMCID: PMC8982023.

[^marvel] Wang J, Al-Ouran R, Hu Y, Kim SY, Wan YW, Wangler MF, Yamamoto S, Chao HT, Comjean A, Mohr SE; UDN; Perrimon N, Liu Z, Bellen HJ.
          MARRVEL: Integration of Human and Model Organism Genetic Resources to Facilitate Functional Annotation of the Human Genome.
          Am J Hum Genet. 2017 Jun 1;100(6):843-853. doi: 10.1016/j.ajhg.2017.04.010. Epub 2017 May 11. PMID: 28502612; PMCID: PMC5670038.

[^diopt] Hu Y, Flockhart I, Vinayagam A, Bergwitz C, Berger B, Perrimon N, Mohr SE.
         An integrative approach to ortholog prediction for disease-focused and other functional studies.
         BMC Bioinformatics. 2011 Aug 31;12:357. doi: 10.1186/1471-2105-12-357. PMID: 21880147; PMCID: PMC3179972.

## Acknowledgments
