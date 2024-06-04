mod routes;

use std::env;
use std::sync::Arc;

use axum::{http::Method, Router};
use gemini_rs::prelude::GeminiClient;
use tower_http::{
    cors::{Any, CorsLayer},
    services::ServeDir,
};

#[derive(Clone)]
struct AppState {
    pub vertex_client: GeminiClient<Arc<dyn gcp_auth::TokenProvider>>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt().init();

    let bind_address = env::var("BIND_ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    let authentication_manager = gcp_auth::provider().await?;
    tracing::info!("GCP AuthenticationManager initialized.");

    let api_endpoint = std::env::var("API_ENDPOINT")?;
    let project_id = std::env::var("PROJECT_ID")?;
    let location_id = std::env::var("LOCATION_ID")?;
    let vertex_client = GeminiClient::new(
        authentication_manager,
        api_endpoint,
        project_id,
        location_id,
    );

    tracing::info!("Created Vertex API Client.");

    let app_state = AppState { vertex_client };

    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods([Method::GET, Method::POST])
        // allow requests from any origin
        .allow_origin(Any);

    // Create Router.
    let app = Router::new()
        .nest_service("/", ServeDir::new("static"))
        .nest("/api", routes::routes())
        .with_state(app_state)
        .layer(cors);

    // Setup TCP Listener..
    let listener = tokio::net::TcpListener::bind(bind_address).await?;

    tracing::info!("listening on {}", listener.local_addr()?);

    // Start serving.
    axum::serve(listener, app).await?;

    Ok(())
}
