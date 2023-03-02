---
title: Gene Homology Explorer
subtitle: Proposal
author: Josh Goodman & Mark Green
date: Spring 2023
geometry: "left=3cm,right=3cm,top=2cm,bottom=2cm"
output: pdf_document
toc: true
---

${toc}

# Abstract



# Introduction

In the field of human genetic research, model organisms play a crucial role in helping to decipher functional mechanisms, disease mechanisms, variant impact, and many other aspects of genes^[needs citation]. Researchers in this field of study rely on previously published data in their organism of interest and also related organisms to discover as much information as possible. A geneticist studying the KRAS gene in humans might look for studies on related genes in mice or rats before designing experiments or looking for drug targets. These related genes are called *orthologs*. Orthologs are homologous genes that are the result of a speciation event^[Koonin EV. Orthologs, paralogs, and evolutionary genomics. Annu Rev Genet. 2005;39:309-38. doi: 10.1146/annurev.genet.39.073003.114725. PMID: 16285863.]. In other words, a gene in one species that is directly, but possibly distantly, related to a gene in another species over an evolutionary time period. *Paralogs*, genes that are the result of a duplication event within a species, can also be used for this same purpose (Figure 1).

```mermaid
flowchart LR
  
  subgraph Species 1
    G1[Ancestral Gene]
  end

  subgraph Species 2
    G2[Orthologous Gene] --> D(Duplication Event) --> G3[Paralogous Gene]
  
  G1 --Speciation Event--> G2

  end
```

![Origin of orthologous and paralogous genes.](docs/images/blank.png)

## Motivation

The exact definition of what constitutes an ortholgous or paralogous pair of genes has been an active area of study for decades^[needs citation]. Over this time, many orthology prediction algorithms have been developed, making it difficult for researchers to select one over the other. To address this issue a meta-orthology tool called [DIOPT](https://www.flyrnai.org/diopt)^[Hu Y, Flockhart I, Vinayagam A, Bergwitz C, Berger B, Perrimon N, Mohr SE. An integrative approach to ortholog prediction for disease-focused and other functional studies. BMC Bioinformatics. 2011 Aug 31;12:357. doi: 10.1186/1471-2105-12-357. PMID: 21880147; PMCID: PMC3179972.] was developed by the Perrimon lab at Harvard Medical School. DIOPT takes the approach of aggregating as many orthology and paralogy algorithm prediction results as possible and presenting all to the end user when a search for one or more genes is conducted. Each homologous pair of genes is scored according to the number of algorithms that have predicted their evolutionary relationship. The tool allows users to enter one or more genes and view results in a tabular format.

While useful, this functionality fails to convey the relationships between the genes being queried within a species, relationships to orthologous genes in other species, and paralogous genes in a visual manner. Herein, we propose the development of a network visualization tool that will allow researchers to explore these relationships, filter based on species, algorithm scores, or other attributes, and easily link out to primary source databases for additional information.

### Related Work

To date, the presentation of results from DIOPT have been limited to tabular HTML results or downloadable tab separated files^[Alliance of Genome Resources Consortium. Harmonizing model organism data in the Alliance of Genome Resources. Genetics. 2022 Apr 4;220(4):iyac022. doi: 10.1093/genetics/iyac022. PMID: 35380658; PMCID: PMC8982023.] ^[Gramates LS, Agapite J, Attrill H, Calvi BR, Crosby MA, Dos Santos G, Goodman JL, Goutte-Gattat D, Jenkins VK, Kaufman T, Larkin A, Matthews BB, Millburn G, Strelets VB; the FlyBase Consortium. FlyBase: a guided tour of highlighted features. Genetics. 2022 Apr 4;220(4):iyac035. doi: 10.1093/genetics/iyac035. PMID: 35266522; PMCID: PMC8982030.].

# Project Proposal

Herein, we propose the development of a network visualization tool that will allow researchers to explore these relationships, filter based on species, algorithm scores, or other attributes, and easily link out to primary source databases for additional information. Below are discussed details of the technical approach to accomplish this task and a project Road Map to outline key milestones and goals throughout the project duration. 

## Technical Approach

**TODO: Temporary notes on ideas for this section**

- Data acquisition, processing, and analysis
  - Python 
- Creation of a data warehouse for storing graph information
  - NoSQL: DuckDB, SQLite, MongoDB, JSON 
  - SQL: PostgreSQL 
  - GraphDB: Dgraph, JanusGraph, or Neo4J
- Possible network analysis to add value to homology data
- Web application that is either pregenerated or fetches data from a "live" API to provide data exploration, filtering, and basic analysis
  - Web frameworks
    - [Astro](https://astro.build)
    - [Remix](https://remix.run)
  - Network visualization
    - [Cytoscape.js](https://js.cytoscape.org/)
    - [Sigma](https://sigmajs.org)
    - [Vega](https://vega.github.io/vega/)

### Data Sources

Briefly discuss how we plan to acquire the data, from what sources, and what (if any) processing might be required.

- Meta orthologs and paralogs [[1]](#diopt)
- [Alliance of Genome Resources](https://www.alliancegenome.org/) - Various model organism data (functional, disease associations, etc.) [[3]](#alliance).

### Data Warehousing and Transformation

No need for a lot of detail here, but I think we should give a high level overview of building a data warehouse. The whys and possible hows.

### Network Analysis Methods

Any processing and data analysis that we think we might want to do.

### Visualization

Talk a little bit about our visualization options. Maybe mention the limitations of each in terms of the network size that they support.

## Project Execution Roadmap

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    axisFormat  %a %m/%d
    title       Gene Homology Explorer - Project Execution Road Map

    section Proposal
    Charter Team              :done, p1, 2023-02-24, 2023-02-25
    Write Proposal            :crit, active, p2, after p1, 6d
    Research Topic and Tools  :active, p3, after p1, 6d
    Team Contract             :active, p4, 2023-03-02, 1d
    Proposal Complete         :milestone, p5, 2023-03-03, 0d

    section Web App Development
    Source and Process Data             :a1, after p5, 7d
    Create and Host Database            :a2, after a1, 7d
    Create Visualizations               :crit, a3, after a2, 21d
    Build Web Things                    :a4, after a2, 21d
    Testing                             :a5, after a3, 7d
    Web App Complete                    :milestone, a6, after a5, 0d

    section Final Report
    Introduction              :f1, 2023-03-26, 7d
    Methods                   :f2, after f1, 14d
    Results                   :f3, after a3, 14d
    Discussion                :crit, f4, after a3, 14d
    Review                    :crit, f5, after f4, 14d
    Final Report Complete     :milestone, f6, after f5, 0d

    section Project Presentation
    Video Materials Prep      :v1, 2023-04-14, 7d
    Video Production          :crit, v2, 2023-04-21, 14d
    Presentation Complete     :milestone, 2023-05-05, 0d

```

# Acknowledgments



# References

Hu Y, Flockhart I, Vinayagam A, Bergwitz C, Berger B, Perrimon N, Mohr SE. An integrative approach to ortholog prediction for disease-focused and other functional studies. BMC Bioinformatics. 2011 Aug 31;12:357. doi: 10.1186/1471-2105-12-357. PMID: 21880147; PMCID: PMC3179972.

Wang J, Al-Ouran R, Hu Y, Kim SY, Wan YW, Wangler MF, Yamamoto S, Chao HT, Comjean A, Mohr SE; UDN; Perrimon N, Liu Z, Bellen HJ. MARRVEL: Integration of Human and Model Organism Genetic Resources to Facilitate Functional Annotation of the Human Genome. Am J Hum Genet. 2017 Jun 1;100(6):843-853. doi: 10.1016/j.ajhg.2017.04.010. Epub 2017 May 11. PMID: 28502612; PMCID: PMC5670038.

Alliance of Genome Resources Consortium. Harmonizing model organism data in the Alliance of Genome Resources. Genetics. 2022 Apr 4;220(4):iyac022. doi: 10.1093/genetics/iyac022. PMID: 35380658; PMCID: PMC8982023.

Koonin EV. Orthologs, paralogs, and evolutionary genomics. Annu Rev Genet. 2005;39:309-38. doi: 10.1146/annurev.genet.39.073003.114725. PMID: 16285863.

Gramates LS, Agapite J, Attrill H, Calvi BR, Crosby MA, Dos Santos G, Goodman JL, Goutte-Gattat D, Jenkins VK, Kaufman T, Larkin A, Matthews BB, Millburn G, Strelets VB; the FlyBase Consortium. FlyBase: a guided tour of highlighted features. Genetics. 2022 Apr 4;220(4):iyac035. doi: 10.1093/genetics/iyac035. PMID: 35266522; PMCID: PMC8982030.

---
