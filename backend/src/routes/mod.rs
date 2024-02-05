mod prompt;

use std::sync::OnceLock;

use crate::AppState;
use axum::{
    extract::{Query, State},
    response::IntoResponse,
    routing::any,
    Router,
};
use moka::future::Cache;
use serde::{Deserialize, Serialize};
use serde_json::json;

use self::prompt::prompt_conversation;

#[derive(Clone, Default, Debug, Deserialize, Serialize)]
struct Message {
    role: String,
    text: String,
}

pub fn routes() -> Router<AppState> {
    Router::new().route("/prompt", any(prompt))
}

#[derive(Debug, Deserialize, PartialEq, Eq, Hash)]
pub struct PromptParams {
    session_id: Option<String>,
    prompt: Option<String>,
}

fn get_messages_cache() -> Cache<String, Vec<Message>> {
    static MESSAGES_CACHE: OnceLock<Cache<String, Vec<Message>>> = OnceLock::new();
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
        vec![Message {
            role: "user".to_string(),
            text: prompt::create_initial_prompt(),
        }]
    });

    tracing::info!("Existing conversation: {:#?}", conversation);
    // Append the user's prompt to the conversation.
    if let Some(prompt) = &params.prompt {
        conversation.push(Message {
            role: "user".to_string(),
            text: prompt.clone(),
        });
    }

    // Convert the conversation to the format expected by the model.
    let model_conversation = conversation
        .iter()
        .map(|message| (message.role.as_str(), message.text.as_str()))
        .collect::<Vec<(&str, &str)>>();

    // Get the response from the model.
    let response = match prompt_conversation(&appstate.vertex_client, &model_conversation).await {
        Ok(response) => response,
        Err(e) => {
            let message = match e {
                prompt::PromptError::VertexError(e) => {
                    format!("Error getting response from prompt: {}", e)
                }
                prompt::PromptError::SerdeError(e) => {
                    format!("Error deserializing response from prompt: {}", e)
                }
            };
            return (axum::http::StatusCode::INTERNAL_SERVER_ERROR, message);
        }
    };

    // Append the model's response to the conversation.
    conversation.push(Message {
        role: "model".to_string(),
        text: serde_json::to_string(&response).unwrap(),
    });

    tracing::info!("conversation: {:#?}", conversation);
    // Save the updated conversation to the session.
    messages_cache
        .insert(session_id.clone(), conversation)
        .await;

    // Return the model's response.
    let json = json!({
        "sessionId": session_id,
        "response": response,
    });
    (
        axum::http::StatusCode::OK,
        serde_json::to_string(&json).unwrap(),
    )
}
