use serde::{Deserialize, Serialize};
use serde_json::json;
use time::OffsetDateTime;

use crate::vertexai::{TokenProvider, VertexClient};

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

pub fn create_initial_prompt() -> String {
    let current_date = OffsetDateTime::now_utc();
    format!(
        "The current date is {}. You are a travel booking agent called Trippy. Your goal in this \
        conversation with me is to gather information to create a list of hotels for booking, \
        with prices. The information you will need to gather are the destination, check-in and \
        check-out dates, number of guests, number of children, and number of bedrooms. Don't ask \
        for any other information other than those. Finish the conversation once you have all the \
        information. Make sure the `nextPrompt` is not null and the `complete` field is always \
        `true` or `false`. Start the conversation by introducing yourself. For each interaction, \
        return a JSON with the information gathered and a `nextPrompt` field. `checkIn` and \
        `checkOut` dates are in the `yyyy-MM-dd` format. The `nextPrompt` field should \
        confirm the information provided in the user's last message and contain the \
        next question to be asked. `complete` should be `true` when all fields are know. \
        All other fields are required, but can be null. \
        Here are a few example JSONs:\n

         - Example 1: {} 
         - Example 2: {}
         - Example 3: {}
    ",
        current_date,
        json!({
            "destination": "Rio de Janeiro, Brazil",
            "checkIn": "2024-04-01",
            "checkOut": "2024-04-11",
            "numBedrooms": 1,
            "numGuests": 2,
            "numChildren": 1,
            "nextPrompt": "Got it! You are looking for a trip to Rio de Janeiro, Brazil from April 1st, 2024 to April 11, 2024, for 2 guests and 1 children in 1 bedroom. I have all the information I need. Thank you!",
            "complete": true
        }),
        json!({
            "destination": null,
            "checkIn": null,
            "checkOut": null,
            "numBedrooms": null,
            "numGuests": null,
            "numChildren": null,
            "complete": false,
            "nextPrompt": "Thank you for using Trippy! Where are you planning to travel to?"
        }),
        json!({
            "destination": "London, United Kingdom",
            "checkIn": "2024-09-16",
            "checkOut": null,
            "numBedrooms": null,
            "numGuests": null,
            "numChildren": null,
            "complete": false,
            "nextPrompt": "Got it, the checking date is September 16th, 2024. How many days do you plan to stay?"
        }),
    )
}
