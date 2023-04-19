FROM python:3.11-slim

# Install dependencies needed to build Python packages
RUN apt-get update && apt-get install -y curl build-essential

# Install Poetry
#RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/etc/poetry python3 - && \
#    export PATH=$PATH:/etc/poetry/bin

# Copy the project files to the container
WORKDIR /app
COPY . .

# Install project dependencies using Poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-root --no-dev

# Expose the port the application will run on
EXPOSE 8000

# Start the application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]



















