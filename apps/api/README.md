# FastAPI Demo

This app serves a basic `FastAPI` access to the homology database, from within a Docker container. To run:

1. Add the `duck.db` file to the `/app/` directory. Example Tree:

```markdown
fastapi-demo
├── app
│   ├── crud.py
│   ├── database.py
│   ├── duck.db
│   ├── **init**.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── docker-compose.yml
├── Dockerfile
├── README.md
└── requirements.txt
```

2. Run with `poetry`

   - `poetry run uvicorn app.main:app` to run the API locally
   - navigate to http://127.0.0.1:8000/docs in browser

3. Or with `docker`
   - `docker compose up` to build and run the container

## TODO

- Add more API things
  - See `../../docs/GeneNeighborhoodAPI` for some inspiration
  - **Add `FastAPI` endpoints** for real-time network analysis calculations `networkx`
  - ~**Add `FastAPI` endpoint** for top-10 search terms for Gene Code lookup~
    - ~for real-time search, `sqlalchemy` a possibility?~
    - ~https://web.archive.org/web/20121013063245/http://playnice.ly/blog/2010/05/05/a-fast-fuzzy-full-text-index-using-redis~
    - ~https://amitosh.medium.com/full-text-search-fts-with-postgresql-and-sqlalchemy-edc436330a0c~
- Some SQL things too
  - ~CREATE TABLE + Index `GeneCode` list in `duck.db` database build phase~
  - ~Additional SQL table/attribute additions if necessary - IE, global network analyses~
- Redis Cache could be useful
  - especially for text search
  - also for neighborhood expansion clicking
