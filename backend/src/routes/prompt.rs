use serde::{Deserialize, Serialize};

use crate::vertexai::{TokenProvider, VertexClient};

pub const BASE_PROMPT: &str = include_str!("./prompt.txt");

#[derive(Default, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PromptResult {
    pub destination: Option<String>,
    pub check_in: Option<String>,
    pub check_out: Option<String>,
    pub num_guests: Option<i32>,
    pub num_children: Option<i32>,
    pub num_bedrooms: Option<i32>,
    pub complete: bool,
    pub next_prompt: Option<String>,
}

pub async fn prompt_conversation<T: TokenProvider + Clone>(
    vertex_client: &VertexClient<T>,
    conversation: &[(&str, &str)],
) -> PromptResult {
    tracing::info!("prompt_conversation: {:#?}", conversation);
    let model_response = vertex_client
        .prompt_conversation(conversation)
        .await
        .unwrap();
    serde_json::from_str::<PromptResult>(&model_response).unwrap()
}
