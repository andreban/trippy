mod prompt;

use std::sync::OnceLock;

use crate::{
    routes::prompt::{create_initial_prompt, recover_conversation, PromptResponse},
    AppState,
};
use axum::{
    extract::{Query, State},
    response::IntoResponse,
    routing::any,
    Router,
};
use gemini_rs::prelude::Dialogue;
use moka::future::Cache;
use serde::Deserialize;
use serde_json::json;

pub fn routes() -> Router<AppState> {
    Router::new().route("/prompt", any(prompt))
}

#[derive(Debug, Deserialize, PartialEq, Eq, Hash)]
pub struct PromptParams {
    session_id: Option<String>,
    prompt: Option<String>,
}

fn get_messages_cache() -> Cache<String, Dialogue> {
    static MESSAGES_CACHE: OnceLock<Cache<String, Dialogue>> = OnceLock::new();
    MESSAGES_CACHE.get_or_init(|| Cache::new(100)).clone()
}

pub async fn prompt(
    State(appstate): State<AppState>,
    Query(params): Query<PromptParams>,
) -> impl IntoResponse {
    tracing::info!("prompt params: {:?}", params);
    let messages_cache = get_messages_cache();

    let session_id = params
        .session_id
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());

    let mut conversation = messages_cache.get(&session_id).await.unwrap_or_else(|| {
        tracing::info!("creating new conversation for session_id: {}", session_id);
        Dialogue::new("gemini-1.0-pro-001")
    });

    let mut prompt = params.prompt.clone().unwrap_or_else(create_initial_prompt);

    let response;
    loop {
        println!(">>>> prompt: {}", prompt);
        let result = match conversation.do_turn(&appstate.vertex_client, &prompt).await {
            Ok(response) => response,
            Err(_) => {
                return (
                    axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                    "API Error".to_string(),
                );
            }
        };

        println!("<<<< result: {}", result.text);

        if let Ok(result) = serde_json::from_str::<PromptResponse>(&result.text) {
            response = result;
            break;
        }

        prompt = recover_conversation();
    }

    messages_cache
        .insert(session_id.clone(), conversation)
        .await;

    // Return the model's response.
    let json = json!({
        "sessionId": session_id,
        "response": response,
    });

    let json = json.to_string();

    (axum::http::StatusCode::OK, json)
}
