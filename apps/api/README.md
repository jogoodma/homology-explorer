# API

This app serves the `FastAPI` API service to provide access to the homology database. To run locally:

1. Add the `homology-explorer/data/duck.db` file to the `../api/app/` directory. Example Tree:

```markdown
api
├── app
│   ├── **init**.py
│   ├── duck.db
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── docker-compose.yml
├── Dockerfile
├── README.md
└── requirements.txt
```

2. Run API service alone with `poetry`

   - `poetry run uvicorn app.main:app` to run the API locally from the `homology-explorer/apps/api/` directory
   - navigate to http://127.0.0.1:8000/docs in browser for the Swagger UI

3. Or build `Dockerfile` image
