FROM python:3.10 AS base
RUN echo "base stage..."
# Configure Poetry
ENV POETRY_VERSION=1.4.0
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache

# Install poetry separated from system interpreter
RUN python3 -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install -U pip setuptools \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

# Add `poetry` to PATH
ENV PATH="${PATH}:${POETRY_VENV}/bin"

WORKDIR /app

# Install dependencies
COPY poetry.lock pyproject.toml ./
RUN poetry install

# Stage 1 build - Run database build
FROM base AS builder
RUN echo "Building DB"
COPY data/*.tsv data/*.py /app/data/
RUN cd /app/data/ && poetry run ./dbBuilder.py

# Stage 2 build - Copy database and run FastAPI server
FROM base AS api
RUN echo "Building API..."
COPY apps/api/ ./apps/api/
COPY --from=builder /app/data/duck.db ./apps/api/app/
WORKDIR /app/apps/api/
EXPOSE 80
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
