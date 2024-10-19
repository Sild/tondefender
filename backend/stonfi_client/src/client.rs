use anyhow::Result;
use crate::api::assets::{GetAssetResp, GetAssetsResp};

pub struct Client {
    api_url: String,
}

impl Client {
    pub fn new() -> Client {
        Client {
            api_url: "https://api.ston.fi/v1".to_string(),
        }
    }

    pub async fn get_asset(&self, addr: &str) -> Result<GetAssetResp> {
        let url = format!("{}/assets/{}", self.api_url, addr);
        let body = reqwest::get(url).await?.text().await?;
        let response = serde_json::from_str::<GetAssetResp>(&body)?;
        Ok(response)
    }

    pub async fn get_assets(&self) -> Result<GetAssetsResp> {
        let url = format!("{}/assets", self.api_url);
        let body = reqwest::get(url).await?.text().await?;
        let response = serde_json::from_str::<GetAssetsResp>(&body)?;
        Ok(response)
    }
}