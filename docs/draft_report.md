---
title: Gene Homology Explorer
subtitle: Final Report - Draft
author: Josh Goodman & Mark Green
date: Spring 2023
geometry: "left=3cm,right=3cm,top=2cm,bottom=2cm"
output: pdf_document
toc: true
---

${toc}

# Abstract

# Introduction

In the field of human genetic research, model organisms play a crucial role in helping to decipher functional
mechanisms, disease mechanisms, variant impact, gene therapy, and many other aspects of genes (Millburn, GH, et. al,; Bulaklak, K, et. al)
Researchers in this field of study rely on previously published data in their organism of interest and also related
organisms to discover as much information as possible. For example, a geneticist studying the KRAS gene in
humans might look for studies on related genes in mice or rats before designing experiments or looking for drug
targets. These related genes are called _orthologs_. Orthologs are homologous genes that are the result of a
speciation event (Koonin EV, et. al). In other words, a gene in one species that is directly, but possibly distantly,
related to a gene in another species over an evolutionary time period. _Paralogs_, genes that are the result of a
duplication event within a species, can also be used for this same purpose.

Although there are many methods for predicting homologous relationships between genes, recent related works
(Hu et. al) have compiled a unified database cataloguing these relationships. While this is extremely useful for
researchers, the tabular format of the database obscures the network structure inherent in the data - whereby edges
are predictions of relationships between genes, and the genes themselves are nodes.

This research aims to close the gap between biomedical researchers and the gene homology database by visualizing the
gene homology network as an interactive, searchable web application capable of exploring orthologous and paralogous
relationships of individual genes, of lists multiple genes, and of their respective gene neighborhoods.
To enhance the researchers understanding of these relationships, we also aim to provide network analysis tools via
the UI to perform network operations of centrality measurement and link community detection.

## Problem Statement

Although data have been compiled to catalogue and rank relationships between genes predicted by a variety of different models, there is not an easily accessible way for researchers to access this data. Previously published attempts at providing a solution have either focused on a very limited set of species (Tulpan et. al) or a limited set of methods for determining homology (Mustafin et. al; Nevers et. al). This leads us to the first and main problem: 

> Provide an easily accessible visual interface allowing model organism genetic researchers to intuitively explore the gene homology network. 

To solve this problem, the team has decided to design a web application to serve network visualization and analysis of the network data in a way that allows users to explore the gene homology network with focus and ease. 

Some additional problem constraints were as follows:

- The application should be easily hostable so that it can be run easily and independently by researchers or hosted on the web.
- The application should to be designed to a production-grade standard such that the application could support a moderate amount of concurrent users. 
- The application should provide an interactive and reactive user interface and allow for users to both search for and drill into various different genes, as well as tailor their results based on parameterizations of the various network operations.

## Project Execution Roadmap

# Methods

The `Homology Explorer` application is an answer to the problem statement above. The sections below outline the technical methodology applied to design and build a prototype of this application. 

## Homology Data

The source of the homology network data consist of three static `.tsv` tables that were obtained from the DIOPT research group (Hu et. al).

Orthology and paraology calls for the following model organism species were included in the Homology Explorer tool from the DIOPT dataset.

**Model Organism Species**
- Arabidopsis thaliana (Thale cress)
- Schizosaccharomyces pombe (Fission yeast)
- Saccharomyces cerevisiae (Yeast)
- Caenorhabditis elegans (Worm)
- Drosophila melanogaster (Fly)
- Danio rerio (Zebrafish)
- Xenopus tropicalis (Western clawed frog)
- Rattus norvegicus (Rat)
- Mus musculus (Mouse)
- Homo sapiens (Human)

The table below outlines the attributes for each table listing the datatype to the left of the attribute name and either `pk` or `fk` to designate fields that are primary keys (to uniquely identify records) and foreign keys (to relate attributes across the tables).

![duckERD.png](./images/duckERD.png)

**Figure XX** - Entity Relationship Diagram of the source data tables.

Some notes on each table and its attributes:

- `OrthologPairs.tsv` :: 11,099,012 records
   - This table contains the _edge_ data for the network.
   - For a given directed edge uniquely identified by `opb_id`, `geneid1` and `geneid2` correspond to the source and target nodes and the `score` corresponds to the edge weight. 
   - The `score` attribute denotes the number of prediction algorithms that predict an homologous relationship from a source gene to a target gene. `best_score` indicates whether a given directed edge has superior weight compared to its inverse edge (directed instead from the _target_ to the _source_). `confidence` is a category derived from `score`.
- `GeneInfo.tsv` :: 371,760 records
   - This table contains the _node_ data of attributes associated with a given gene.
   - The `GeneInfo.geneid` field relates to the `OrthologPairs.geneid*` while the `symbol` and `description` help to colloquially identify a given gene.
   - `chromosome` and `gene_type` are additional descriptive attributes for the gene, while the `map_location` is a legacy methodology for identifying different genes. 
- `Species.tsv` :: 10 records
   - This table contains taxonomy information for the species to which the genes in our database belong. 
   - The `Species.taxonomyid` field relates to the `GeneInfo.speciesid` field to provide a given species' common and scientific/latin names.

## Web Application Design

At its core, the `Homology Explorer` application aims to serve network data visualizations to users. An application is designed consisting of four key components to accomplish this task, as overviewed below:

- **Pre-processing the source data** converts the static `.tsv` files into a Duck database `.db` format. This stage joins and permutes the data to a new static form that will be easily accessible by the web application. 
- A `Caddy` **Web Server** manages SSL encryption and routes HTTP traffic between the API and UI services, and the users.
- The backend **Application Programming Interface** (API) service runs the database and implements the python `FastAPI` object relational model (ORM) framework to aynchronously manage database access, serialize, validate, and apply network and filtering analyses to the data.
- The frontend **User Interface** (UI) service runs the visualization application by implementing the `Sigma.js` and `Graphology` network libraries through a javascript `React` framework.

The schematic below outlines the described web application architecture.

```mermaid
flowchart LR
    cad<--http://127.0.0.1:8000-->u((Users))

    subgraph dock[Homology Explorer Docker Container]

        subgraph web[Proxy Service]
            cad[[::Caddy::\nWeb Server\nReverse Proxy]]
        end

        js<--http://127.0.0.1:4173-->cad;
        py<--http://127.0.0.1:80-->cad;

        subgraph ui[UI Service]
            js[[::Node.JS 18::\npnpm\nReact\nVite\nSigma\nGraphology\nChakra-UI\nEmotion]]
        end

        subgraph api[API Service]
            
            subgraph db[Stage 1: Build Database]
                tsv([::Raw::\nOrthologPairs.tsv\nGeneInfo.tsv\nSpecies.tsv])
                dbb[[::Python::\ndbBuilder.py\nduckdb]]                
                tsv-->dbb
            end

            subgraph fastapi[Stage 2: Build API]
                duck[(::SQL::\nHomology Database\nduck.db)]
                py[[::Python::\nFastApi\nSQLAlchemy\npydantic\nnetworkx\nlinkcom\nduckdb-engine]]
                duck-->py
            end
            dbb-->duck;
        end
    end
```

```
homology-explorer
├── apps
│   ├── api
│   │   ├── app
│   │   └── Dockerfile
│   └── ui
│       ├── node_modules
│       ├── public
│       ├── src
│       └── Dockerfile
├── data
├── docs
├── Caddyfile
├── docker-compose.yml
├── pnpm-lock.yaml
├── poetry.lock
└── pyproject.toml

```

The tree above outlines the general directory structure of the app and will be revisited at various points throughout the report in more detail. The code for this project is available on [Github](https://github.com/jogoodma/homology-explorer/tree/main). The subsequent sections outline the technical implementation of the above described web application design in such a way as to satisfy the constraints set out by the problem statement.

## Database Construction

The source data have a fixed schema and are relational so managing them through a SQL database is a natural design choice^[cite some stuff from database class]. Of the myriad flavors of SQL to choose from, the `Homology Explorer` uses Duck Database^[https://duckdb.org/]. Duck database is a lightweight SQL database similar to SQLite. Because the dataset  however, it is more performant and provides many more features than SQLite. It also has good documentation and a rich python API. To construct the database, these tables are first extracted from the `tar.gz` file. Next the `duckdb` python library is used by `dbBuilder.py` file to create the application database: `duck.db`.

```
data
├── GeneInfo.tsv
├── OrthologPairs.tsv
├── Species.tsv
├── dbBuilder.py
└── duck.db
```

Each `.tsv` file is loaded to the database as a table. However, the tables themselves are not exposed to the web application. Instead, a variety of views query data from the tables into formats expected by the API object relational models. This is advantageous from an application performance standpoint since initializing the data into the ORM formats sometimes requires computationally intensive `JOIN` operations for which SQL is optimized.

Below are described the various tables and views created by the `dbBuilder.py`:

**_Tables_**

- **tblOrthologPairs**
  - Original table of attributes for each `opb_id` (edge).
- **tblGeneInfo**
  - Original table of attributes for each `geneid` (node).
- **tblSpecies**
  - Original table relating `species_id` to common and scientific names.

**_Views_**

- **evwGeneFrequency**
  - View aggregates `tblOrthologPairs` to count the frequency of each `geneid`.
- **evwSymbolSearch**
  - View joins to `tblGeneInfo` the `tblSpecies.common_name` and `evwGeneFrequency.frequency` for queries related to UI dynamic search results.
- **evwGeneInfo**
  - View joins to `tblGeneInfo` the `tblSpecies` attributes to provide a enrich queries accessing node attributes.
- **evwOrthologPairs**
  - View adds edge attribute `homolog_type` as binary classification of a given homolog as either an _ortholog_ (inter-species) or a _paralog_ (intra-species).
- **evwGeneNeighborEdges** & **evwGeneNeighborEdgesAttr**
  - Views are called together to serialize the edge attributes from `tblOrthologPairs` as a nested dictionary below the `key`, `source`, and `target`.
  - These views _only_ select edges which are the `best_score`.
- **evwGeneNeighborEdgelist**
  - View called to serialize the edge attributes from `tblOrthologPairs` into an edgelist format readable by `networkx`.
- **evwGeneNeighborNodes** & **evwGeneNeighborNodesAttr**
  - Views are called together to serialize the node attributes from `tblGeneInfo` as a nested dictionary below the `key`.
  - The `evwGeneNeighborNodesAttr` view also joins the `tblSpecies` attributes to `tblGeneInfo` to enrich the attribute output.

The `dbBuilder.py` script constructs this `duck.db` database using the DuckDB python API. Once constructed, it is then embedded the API service at `apps/api/app/duck.db` where it is accessed by the web application as needed.

## Application Programming Interface

An application programming interface (API) can be used to efficiently broker, transform, and validate data between the database and the UI by managing the database requests made by the UI as the user interacts with the application. Python is the preferred language for this API because the application relies on the extensive `networkx` python library to compute network analyses. Keeping the API semantics within the same language as the main computational library maintains a level of desirable level of simplicity. 

`FastAPI` is a popular python RESTful API web framework focused on high performance and easy development^[https://fastapi.tiangolo.com/]. We selected the framework for our web application backend because:
- `FastAPI` can run asynchronously through an ASGI^[https://asgi.readthedocs.io/en/latest/] (Asynchronous Server Gateway Interface) which allows it to efficiently enqueue, await, and handle API calls from multiple concurrent users. It also boosts performance for API calls requiring multiple SQL queries to construct the response body. 
- `FastAPI` supports object relational modelling through the `SQLAlchemy` library to mix the database queries seamlessly with the `networkx` python library. 
- `FastAPI` supports datatype validation through the `types` and `pydantic` libraries. This ensures the API is sending an appropriate valid response to a requester, and helps determine if the request is even valid in the first place. 
- `FastAPI` also supports several methods for implementing a cache-aside framework which can help increase performance for APIs with high throughput. Since that is an expected use-case scenario for this application, this version has *not* been developed with cacheing. This may be an advantageous feature one day in the future if the application use-case ever expands. 
- `FastAPI` has the Swagger Docs interface tool enabled by default which makes developing the API much easier by providing an easy way to test different API requests, responses, and ORM schemas.
- There is good documentation and it is a relatively easy framework to learn and implement. For example, this API application is largely inspired by this official tutorial^[https://fastapi.tiangolo.com/tutorial/sql-databases/] from the `FastAPI` documentation.

Below is an example directory structure of the `FastAPI` API service embedded with the `duck.db` database.

```
apps/api
├── app
│   ├── __init__.py
│   ├── crud.py
│   ├── database.py
│   ├── duck.db
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── Dockerfile
└── requirements.txt
```

- **database.py**
   - This file handles ORM session connections to the database with `SQLAlchemy`.
- **models.py**
   - This file structures the SQL tables into an object relational model (ORM) with `SQLAlchemy`.
   - Once instantiated as an ORM object, the tables are easy to manipulate using other python libraries. 
- **schemas.py**
   - This file enforces data types and structural representations of ORM objects with `pydantic`.
   - Both objects used for posts and responses are validated according to these schema.
- **crud.py**
   - This file parses, analyzes, and transforms ORM objects with `SQLAlchemy` and `networkx`.
- **main.py**
   - This file functionalizes the `crud.py` operations and serves the requests through HTTP API calls with `FastAPI`
   - It also validates POST and GET operations and constrains inputs/outputs according to design specifications, and assigns query and path parameters to HTTP routes. 

This API is run through the `uvicorn`^[cite Uvicorn] ASGI as recommended by the `FastAPI` documentation^[cite]and works, more or less, as follows for each of the API endpoints:

- The UI sends an HTTP request with the query and path parameters specified by one of the available API endpoints in `main.py`. 
- If a valid endpoint is called, the endpoint then:
   - _validates the request_ body schema and the query and path parameter datatypes.
   - _executes_ CRUD operations by transforming the ORM models connected to the database.
   - _serializes_ a response to a particular output format.
   - _validates the response_ datatypes according to a given output schema.
   - _returns_ the HTTP response body to the requester.

And that's it! The API endpoints all vary somewhat depending on their intended purpose, but follow this generalized order of operations. Some API endpoints only involve one database query while others are composed of several database queries. In the case of this API, all of the endpoints are designed to help a user explore the network of genes stored by the gene homology database. These endpoints are discussed individually at length in the sections below.

### Information and Search

GET Calls:
- `/search/gene/symbol/{symbol}/`
- `/geneinfo/gene/{gene_id}/`
- `/orthologpairs/gene/{gene_id}/`

These endpoints query basic information from views of the database tables. The `/search/gene/symbol/` endpoint is used to populate search results for the dynamic search option at the beginning of the UI. The other two endpoints return either the node attributes or a list of edges attached to the single requested gene.

### Multigene Requests

POST Calls:
- `/geneinfo/multigene/`
- `/orthologpairs/multigene/`

These endpoints require the user to post the request body as a list of `geneid`s. The endpoint parses the list by changing the comparative of the SQL `WHERE` clause from `=` (as used in the `/.../gene/` GET endpoints) to `IN`. In this way, the multigene endpoints are able to provide node and edge info in a similar manner to the single gene endpoints, but for a list of genes instead. 

### The Gene Neighborhood

GET Calls:
- `/geneneighboredges/gene/{gene_id}/`
- `/geneneighbornodes/gene/{gene_id}/`

POST Calls:
- `/geneneighboredges/multigene/`
- `/geneneighbornodes/multigene/`

These `geneneighbor*` endpoints are composed of two CRUD operations. The first CRUD operation for each endpoint computes the *gene neighborhood*, a list of all the distinct first degree neighbors of the requested gene or genes. This operation can be parameterized by an upper or lower bound to constrain the neighbors to only those first degree neighbors whose weights are constrained by the bounded interval. This provides a way to filter a neighborhood's edges by weight. 

By calling a commonly parameterized initialization function the gene neighborhood allows for multiple different API calls to reference the same subgraph of nodes. This makes these kinds of calls easier for developers to implement by allowing the same subgraph to be easily re-queried for a variety of different information. 

The second CRUD operation then fetches either:
1. Nodes - and then returns gene information for each node in the gene neighborhood of the requested gene or genes; or,
2. Edges - and then returns a list of homolog edges for each edge between each node pair within the gene neighborhood of the requested gene or genes. 

TODO: Update `crud.get_GeneNeighborEdgelist` to take as arguments the weight_lb and weight_ub

The gene neighborhood represents the closest related genes to those queried as defined by various homology prediction algorithms. 

### Network Analysis

POST Calls:
- `/geneneighboredges/multigene/{analysis}`
- `/geneneighbornodes/multigene/{analysis}`

A network analysis endpoint is available for computing network attributes on either nodes or edges while the requested network analysis is passed to the endpoint as a path parameter string. Additional query parameters can also be used to toggle the output of the analysis by tuning various hyperparameters. Network analysis endpoints are constructed in a manner similar to the multigene gene neighborhood endpoints and operate as follows:

1. The MultiGene Neighborhood query is called and the resultant edge information are serialized to an edgelist format - a list of 3-dimensional tuples composed of the source and target genes and weight for a given edge.
2. The edgelist is converted to an `nx.Graph()` object upon which is run a `networkx` function of some kind. This returns an edgelist or nodelist with the newly calculated network analysis attribute.
3. The newly calculated attribute from step 2 is appended to the node or edge attributes for the gene neighborhood determined in step 1. This returns a new list of edges or nodes along with all the attributes (original and calculated) for each object of the list. 

This framework is advantageous since the only difference between each network analysis is the CRUD operation performing the `networkx` function called in step 2. These CRUD operations are quite simple to construct, and then it is just a matter of making the path parameter available as a request to the network analysis endpoint. 

For example, the network CRUD operation for the `geneneighbornodes/multigene/PageRank/` call only consists of 8 lines:

```python
def get_Pagerank(db: Session, edgelist: list, alpha: float):
     
    g = nx.DiGraph()
    g.add_edges_from(edgelist)
    
    pagerank = nx.pagerank(g, alpha=alpha, weight='weight')
    
    newnodeattr = [
        { 'key': key, 'attributes': { 'pagerank': value } }
        for key, value in pagerank.items()
    ]
    
    return newnodeattr
```

... and the network CRUD operation for the `geneneighboredges/multigene/Linkcom/` call consists of scant more:

```python
def get_Linkcom(db: Session, edgelist: list, threshold: float):
    
    g = nx.Graph()
    g.add_edges_from(edgelist)
    
    e2c,_ = linkcom.cluster(
        g, threshold=threshold, 
        is_weighted=True, weight_key='weight',
        to_file=False
    )
    
    newedgeattr = [ 
        { 
          'source': key[0], 
          'target': key[1],
          'attributes': {
            'linkcom': value
          }
        } for key, value in e2c.items()
    ]
    
    return newedgeattr
```


## User Interface

### Core Dependencies

The user interface for the Homology Explorer is primarily written in Typescript with the following libraries providing
the core functionality:

* React - View layer responsible for controlling the overall layout, the graph components, user interactivity, and managing application state
* react-sigma - Utility library for bridging functionality between React and Sigma.js
* Sigma.js - Graph visualization library
* Graphology - Graph library for representing and working with graph data structures.
 
A list of all dependencies can be found in the [UI package.json file](https://github.com/jogoodma/homology-explorer/blob/docker/apps/ui/package.json).

### Sigma.js

Sigma.js was chosen over other web based network visualization libraries (e.g. CytoscapeJS and Vega) for its use of
Canvas vs SVG and its tight integration with Graphology (a JS graph library). Canvas provides better performance over SVG when the number
of objects displayed is large.

### Dynamic Search

The landing page of the Homology Explorer is our simple dynamic search page. This page has a single
input field that allows a user to enter a gene symbol. As the user types, a query is sent to the gene symbol
query API endpoint, an autocomplete box appears, and then the results from the query are displayed
(Figure XX). Clicking the "View Network" box then takes the user to the primary network visualization.

![Example of a dynamic search for BCL6](./images/dynamic_search_BCL6.png)

**Figure XX** - Example of a gene search for BCL6.

### Visualization

The network visualization is controlled by React (React) components that manage the application views and state. The `GeneNetwork`
component takes the requested gene ID, the application state, and event handlers and creates the network visualization
via the react-sigma (react-sigma) bindings for the Sigma.js library (sigma.js). The Graphology.js (Graphology) library was used to implement the
graph filtering logic provided by the application.

# Results

## PTEN

In Figure XX, the gene homology network for the Human PTEN gene is shown. PTEN is a tumor suppressor that when mutated
results in a wide variety of cancers (PTEN, Alliance of Genome Resources). PTEN shows clear orthology to genes in other species (light orange edge colors)
and a paralog TPTE. The paralog TPTE, shows strong homology to a cluster (purple edge color) of model organism genes
and another human gene (TPTE2). There are also 5 other predominate link communities that are indicated. 
In this example, we show that a connection that is 2-3 degrees away is clearly visible
in a single presentation with the Linkcom analysis. Compared with the tabular view, which would have required several
additional clicks and sorting through dozens of genes.


![PTEN gene network](./images/pten_network.png)
**Figure XX** - Gene homology network of PTEN. PTEN and its human paralog (TPTE) are highlighted in red.

## Example 2

In Figure XX, the gene homology network for the Human BCL6 gene is shown. BCL6 is a gene known to be involved in B-cell 
lymphoma (BCL6, Alliance of Genome resources). BCL6 shows homology to a small cluster of genes with high confidence as indicated by the thick edges
of blue and cyan and low confidence orthology calls to 4 *D. melanogaster* genes whose node size has been accentuated by the 
PageRank centrality analysis (highlighted in red). Additionally, thes 4 genes all have symbols with CG#, indicating
that their function is not known or that they are not well studied. The graph also
indicates that these genes have many connections to a cluster of human genes (yellow link edges) that are all 
zinc finger type genes. This information could be used for additional experimentation to confirm zinc finger activity
of the 4 *D. melanogaster* genes.


![BCL6 gene network](./images/bcl6_network.png)
**Figure XX** - Gene homology network of BCL6. BCL6 and a cluster of 4 *D. melanogaster* genes are highlighted in red. The unnamed genes are accentuated by the PageRank analysis and are involved in a community of human zinc finger genes indicated by the yellow edges.

## Example 3

In Figure XX, the gene homology network for 18w in *D. melanogaster* is shown. 18w is a gene that contributes to multiple processes including ovarian follicle cell migration, antibacterial humoral response and ventral cord development (18w, Alliance of Genome Resources).
In part A, you see the entirety of the complex network that 18w is associated with. In part b, the same network is shown,
but with homology calls with scores of less than 4 removed.  This demonstrates the ease with which the tool can be used
to remove complexity and allow researches to focus on high value data easily.

![18w network before filtering by score](./images/18w_pre_filtered_network.png)
![18w network after filtering by score](./images/18w_post_filtered_network.png)
**Figure XX A and B** - Gene homology network of 18w in *D. melanogaster*. Figure XXA displays a complex network with
many interconnections. Figure XXB displays the same network, but with all homology scores of less than 4 removed.

# Discussion

## Next Steps

* Design improvements
* Collect and iterate over domain expert feedback
*  

# References

React, https://react.dev/

Typescript, https://www.typescriptlang.org/

react-sigma, https://sim51.github.io/react-sigma/

sigma.js, https://www.sigmajs.org/

Graphology, https://graphology.github.io/

Tulpan D, Leger S. The Plant Orthology Browser: An Orthology and Gene-Order Visualizer for Plant Comparative Genomics. Plant Genome. 2017 Mar;10(1). doi: 10.3835/plantgenome2016.08.0078. PMID: 28464063.

Mustafin ZS, Lashin SA, Matushkin YG, Gunbin KV, Afonnikov DA. Orthoscape: a cytoscape application for grouping and visualization KEGG based gene networks by taxonomy and homology principles. BMC Bioinformatics. 2017 Jan 27;18(Suppl 1):1427. doi: 10.1186/s12859-016-1427-5. PMID: 28466792; PMCID: PMC5333177.

Nevers Y, Kress A, Defosset A, Ripp R, Linard B, Thompson JD, Poch O, Lecompte O. OrthoInspector 3.0: open portal for comparative genomics. Nucleic Acids Res. 2019 Jan 8;47(D1):D411-D418. doi: 10.1093/nar/gky1068. PMID: 30380106; PMCID: PMC6323921.

Hu Y, Flockhart I, Vinayagam A, Bergwitz C, Berger B, Perrimon N, Mohr SE. An integrative approach to ortholog prediction for disease-focused and other functional studies. BMC Bioinformatics. 2011 Aug 31;12:357. doi: 10.1186/1471-2105-12-357. PMID: 21880147; PMCID: PMC3179972.

PTEN, https://www.alliancegenome.org/gene/HGNC:9588#disease-associations

BCL6, https://www.alliancegenome.org/gene/HGNC:1001#disease-associations

18w, https://www.alliancegenome.org/gene/FB:FBgn0004364#summary

Koonin EV. Orthologs, paralogs, and evolutionary genomics. Annu Rev Genet. 2005;39:309-38. doi: 10.1146/annurev.genet.39.073003.114725. PMID: 16285863.

Millburn GH, Crosby MA, Gramates LS, Tweedie S; FlyBase Consortium. FlyBase portals to human disease research using Drosophila models. Dis Model Mech. 2016 Mar;9(3):245-52. doi: 10.1242/dmm.023317. PMID: 26935103; PMCID: PMC4826978.

Bulaklak K, Gersbach CA. The once and future gene therapy. Nat Commun. 2020 Nov 16;11(1):5820. doi: 10.1038/s41467-020-19505-2. PMID: 33199717; PMCID: PMC7670458.