from fastapi import FastAPI
import datetime

app = FastAPI()

# Hardcoded data
sites_confidence = {
    "https://example.com": "good",
    "https://badsite.com": "bad",
    "https://unknownsite.com": "unknown"
}

coins_confidence = {
    "Bitcoin": "good",
    "ScamCoin": "bad",
    "MysteryCoin": "unknown"
}

@app.get("/")
def read_root():
    return {"message": "Welcome to the TonDefender API"}

# Get the confidence value for a site by URL
@app.get("/site")
def get_site_confidence(url: str):
    confidence = sites_confidence.get(url, "undefined")
    return {"confidence": confidence}

# Get the confidence value for a coin by name
@app.get("/coin")
def get_coin_confidence(name: str):
    confidence = coins_confidence.get(name, "undefined")
    return {"confidence": confidence}

# Get all sites
@app.get("/sites")
def get_sites():
    sites = []
    for url, confidence in sites_confidence.items():
        site = {
            "url": url,
            "confidence": confidence,
            "updated_at": datetime.datetime.utcnow().isoformat()
        }
        sites.append(site)
    return sites

# Get all coins
@app.get("/coins")
def get_coins():
    coins = []
    for name, confidence in coins_confidence.items():
        coin = {
            "name": name,
            "confidence": confidence,
            "updated_at": datetime.datetime.utcnow().isoformat()
        }
        coins.append(coin)
    return coins

# Endpoints for changes (return empty lists since data is hardcoded)
@app.get("/sites/changes")
def get_site_changes(after: datetime.datetime):
    return []

@app.get("/coins/changes")
def get_coin_changes(after: datetime.datetime):
    return []