use std::sync::Arc;

use gcp_auth::AuthenticationManager;

use super::Result;

pub trait TokenProvider {
    async fn get_token(&self, scope: &[&str]) -> Result<String>;
}

impl TokenProvider for Arc<AuthenticationManager> {
    async fn get_token(&self, scope: &[&str]) -> Result<String> {
        match AuthenticationManager::get_token(self, scope).await {
            Ok(token) => Ok(token.as_str().to_string()),
            Err(e) => Err(e.into()),
        }
    }
}
