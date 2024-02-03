FROM rust:1 as rustbuilder
WORKDIR /app
COPY backend/ .
RUN cargo install --path .

FROM node:lts as nodebuilder
WORKDIR /app
COPY frontend/ .
RUN npm install
RUN npm run build

FROM debian:bookworm-slim
RUN apt update
RUN apt install openssl ca-certificates -y

WORKDIR /app
COPY --from=rustbuilder /usr/local/cargo/bin/backend /usr/local/bin/backend
COPY --from=nodebuilder /app/dist /app/static
COPY ./gcp-credentials.json /app/gcp-credentials.json
EXPOSE 8080
CMD ["backend"]

