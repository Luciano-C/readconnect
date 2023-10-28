FROM python:3.11

# Installing some basic utilities that might be needed for Python libraries and netcat for our entrypoint script
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Create user and group
RUN addgroup fastapi && useradd -m -g fastapi fastapi

# Set working directory
WORKDIR /app/

# Copy the requirements first to leverage Docker cache
COPY --chown=fastapi requirements.txt .

# Install the Python dependencies
RUN pip --no-cache-dir install -r requirements.txt

# Copy the rest of the code, the json file for data population, and the entrypoint script
COPY --chown=fastapi . .
COPY --chown=fastapi amazon.books.json .

# Copy the entrypoint script
COPY --chown=fastapi entrypoint.sh ./

# Give execute permissions to the entrypoint script
RUN chmod +x entrypoint.sh

# Expose the port the app runs on
EXPOSE 8000

# Command to run the entrypoint script
CMD ["./entrypoint.sh"]
