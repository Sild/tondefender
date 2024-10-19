use anyhow::Result;

fn init_logging() {
    let _ = env_logger::builder().filter_level(log::LevelFilter::Debug).try_init();
}

#[tokio::test]
async fn test_assets() -> Result<()> {
    init_logging();
    let stonfi_client = stonfi_client::Client::new();
    let rsp = stonfi_client.get_assets().await?;
    assert_ne!(rsp.asset_list.len(), 0);

    let ton_addr = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
    let rsp = stonfi_client.get_asset(ton_addr).await?;
    let ton = rsp.asset;
    assert_eq!(ton.contract_address, ton_addr);
    assert_eq!(ton.display_name.unwrap(), "TON");
    Ok(())
}
