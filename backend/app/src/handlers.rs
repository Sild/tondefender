use axum::body::Body;
use axum::extract::{Query, State};
use axum::response::Response;
use serde::Deserialize;
use crate::state::StatePtr;

pub async fn root() -> Response {
    Response::new(Body::from("hi"))
}


#[derive(Deserialize)]
pub struct CoinParams {
    address: Option<String>,
}

pub async fn coin(State(state): State<StatePtr>, Query(params): Query<CoinParams>) -> Response {
    let address = params.address.unwrap_or_default();
    if address.is_empty() {
        return Response::new(Body::from("'address' param is required"));
    }
    let asset = match state.read().await.get_asset_confidence(&address).await {
        Ok(asset) => asset,
        Err(e) => return Response::new(Body::from(format!("error: {:?}", e))),
    };
    Response::new(Body::from(format!("{:?}", asset.confidence)))

    // let state = state.read().await;
    // // let asset = state.get_asset(&address).unwrap();
    // Response::new(Body::from(format!("{:?}", asset.confidence)));
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