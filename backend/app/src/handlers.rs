use std::str::FromStr;
use axum::body::Body;
use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::Response;
use serde::Deserialize;
use tonlib_core::TonAddress;
use crate::state::StatePtr;
pub async fn root() -> Response {
    Response::new(Body::from("hi"))
}


#[derive(Deserialize)]
pub struct AddressInfoParams {
    address: Option<String>,
}

pub async fn address_info(State(state): State<StatePtr>, Query(params): Query<AddressInfoParams>) -> Result<String, StatusCode> {
    let address = params.address.unwrap_or_default();
    if address.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    if let Err(err) = TonAddress::from_str(&address) {
        log::warn!("Fail to parse address: {address}, err: {:?}", err);
        return Err(StatusCode::BAD_REQUEST);
    }
    let maybe_asset = match state.read().await.get_asset(&address).await {
        Ok(asset) => asset,
        Err(e) => return {
            log::error!("Error getting asset: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        },
    };
    match maybe_asset {
        Some(asset) => {
            let rsp_body = match serde_json::to_string(&asset) {
                Ok(body) => body,
                Err(e) => {
                    log::error!("Error serializing asset: {:?}", e);
                    return Err(StatusCode::INTERNAL_SERVER_ERROR);
                }
            };
            log::debug!("Found asset for addr: {address}");
            Ok(rsp_body)
        },
        None => Err(StatusCode::NOT_FOUND),
    }
}

#[derive(Deserialize)]
pub struct SiteParams {
    site: Option<String>,
}

pub async fn site(State(state): State<StatePtr>, Query(params): Query<SiteParams>) -> Response {
    let site = params.site.unwrap_or_default();
    if site.is_empty() {
        return Response::new(Body::from("'site' param is required"));
    }
    let confidence = state.read().await.get_domain_confidence(&site);
    Response::new(Body::from(confidence))
}