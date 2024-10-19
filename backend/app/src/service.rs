use crate::state::{State as AppState, StatePtr};
use axum::routing::{get, post};
use axum::Router;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::handlers;

pub struct Service {
    app_state: StatePtr,
}

impl Service {
    pub async fn new() -> anyhow::Result<Self> {
        let mut app_state = AppState::new();
        app_state.refresh().await?;

        let service = Self {
            app_state: Arc::new(RwLock::new(app_state)),
        };
        Ok(service)
    }

    pub async fn run(self, listening_addr: &str) -> anyhow::Result<()> {
        let app = Router::new()
            .route("/", get(handlers::root))
            .route("/coin/", get(handlers::coin))
            .route("/site/", get(handlers::site))
            .with_state(self.app_state.clone());

        log::info!("listening on http://{}/", listening_addr);
        let listener = tokio::net::TcpListener::bind(listening_addr).await?;
        axum::serve(listener, app).await?;
        Ok(())
    }
}
