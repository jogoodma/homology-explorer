# FastAPI Demo

This app serves a basic `FastAPI` access to the homology database, from within a Docker container. To run:

1. Add the `duck.db` file to the `/app/` directory. Example Tree:

```markdown
fstapi-demo
├── app
│   ├── crud.py
│   ├── database.py
│   ├── duck.db
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── docker-compose.yml
├── Dockerfile
├── README.md
└── requirements.txt
```

2. Either: 
   + `poetry run uvicorn app.main:app` to run the API locally
   + `docker compose up` to build and run the container

## TODO

Next steps are to upgrade the basic API as inspired by the `GeneNeighborhoodAPI`. See `../../docs`.

