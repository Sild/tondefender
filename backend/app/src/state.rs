use std::collections::HashMap;
use std::sync::Arc;
use serde::Serialize;
use tokio::sync::RwLock;
use stonfi_client::Client;

#[derive(Clone, Debug, Serialize)]
pub enum Confidence {
    Ok,
    Bad,
    Unknown,
}

#[derive(Clone, Debug)]
pub struct Asset {
    pub asset_data: stonfi_client::api::types::Asset,
    pub confidence: Confidence,
}

pub type StatePtr = Arc<RwLock<State>>;

pub struct State {
    stonfi_client: Client,
    stonfi_whitelist_map: HashMap<String, Asset>,
    domains: HashMap<String, Confidence>,
}

impl State {
    pub fn new() -> Self {
        Self {
            stonfi_client: Client::new(),
            stonfi_whitelist_map: Default::default(),
            domains: Default::default(),
        }
    }

    pub(crate) async fn refresh(&mut self) -> anyhow::Result<()> {
        let assets = self.stonfi_client.get_assets().await?;
        self.stonfi_whitelist_map.clear();
        for raw_asset in assets.asset_list {
            let confidence = if raw_asset.community {
                Confidence::Unknown
            } else {
                Confidence::Ok
            };
            let asset = Asset {
                asset_data: raw_asset,
                confidence: confidence.clone(),
            };
            self.stonfi_whitelist_map.insert(asset.asset_data.contract_address.clone(), asset);
        }

        let domains = HashMap::from([
            ("ston.fi".into(), Confidence::Ok),
            ("dedust.io".into(), Confidence::Bad),
        ]);
        self.domains = domains;
        Ok(())
    }

    pub async fn get_asset_confidence(&self, addr: &str) -> anyhow::Result<Confidence> {
        if self.stonfi_whitelist_map.contains_key(addr) {
            log::debug!("found asset in whitelist map: {addr}");
            let asset = self.stonfi_whitelist_map.get(addr).unwrap();
            return Ok(asset.confidence.clone())
        }
        let asset = match self.stonfi_client.get_asset(addr).await? {
            Some(rsp) => rsp.asset,
            None => {
                log::debug!("asset not found: {addr}");
                return Ok(Confidence::Unknown)
            },
        };
        log::debug!("asset {addr} found by extra request");
        let confidence = if asset.blacklisted {
            Confidence::Bad
        } else {
            Confidence::Unknown
        };
        Ok(confidence)
    }

    pub fn get_domain_confidence(&self, name: &str) -> String {
        let val = self.domains.get(name).cloned()
            .unwrap_or(Confidence::Unknown);
        format!("{:?}", val)
    }
}