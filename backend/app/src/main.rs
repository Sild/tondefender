mod state;
mod service;
mod handlers;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let _ = env_logger::builder().filter_level(log::LevelFilter::Debug).try_init();
    let service = service::Service::new().await?;
    service.run("0.0.0.0:8090").await
}