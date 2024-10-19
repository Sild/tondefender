use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Meta {
    custom_payload_api_uri: String,
    decimals: i32,
    display_name: String,
    image_url: String,
    symbol: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Asset {
    pub contract_address: String,
    pub symbol: String,
    pub display_name: String,
    pub kind: String,
    pub deprecated: bool,
    pub community: bool,
    pub blacklisted: bool,
    pub default_symbol: bool,
    pub taxable: bool,
}