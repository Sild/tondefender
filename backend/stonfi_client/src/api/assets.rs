use serde::{Deserialize, Serialize};
use crate::api::types::Asset;

#[derive(Serialize, Deserialize, Debug)]
pub struct GetAssetsResp {
    pub asset_list: Vec<Asset>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetAssetResp {
    pub asset: Asset
}