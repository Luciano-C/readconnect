#!/bin/sh

# Wait for the database to be ready
while ! nc -z db 3306; do
  echo "Waiting for the MySQL database to be ready..."
  sleep 3
done

python init_db.py
python populate_db.py

# Start your FastAPI application
exec uvicorn app:app --host 0.0.0.0 --port 8000