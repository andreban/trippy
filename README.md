# Trippy

Trippy is a web application powered by AI that helps you plan your next trip. It uses Google's
Gemini Pro via the Vertex AI to help guide the user through choosing a destination, dates, and
other details to book a hotel.

## Docker

Build the container
```sh
docker build -t trippy:latest .
```

Run the container
```sh
docker run -d --env-file env-file.txt -v ${pwd}/gcp-credentials.json:/app/gcp-credentials.json:ro -p 80:8080 trippy:latest
```
