const injectedTabs = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    !injectedTabs.has(tabId)
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        func: load_handler,
      })
      .then(() => {
        injectedTabs.add(tabId);
      })
      .catch((err) => console.error(err));
  }
});

async function load_handler() {
  let ton_connect_str = new Set(['ton-connect', 'tonconnect']);

  function site_has_ton_connect(site_body) {
    let site_lower = site_body.toLowerCase();
    for (let str of ton_connect_str) {
      if (site_lower.includes(str)) {
        return true;
      }
    }
    return false;
  }

  function check_url(apiEndpoint, url) {
    return fetch(`${apiEndpoint}?site=${encodeURIComponent(url)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.text();
      })
      .then((domain_status) => {
        console.log('Received string:', domain_status);
        return domain_status;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        throw error;
      });
  }

  function extractDomain(url) {
    const domain = url.match(/:\/\/(www\.)?(.[^/]+)/)[2];
    const domainParts = domain.split('.');
    const secondLevelDomain = domainParts.slice(-2).join('.');
    return secondLevelDomain;
  }

  async function is_whitelisted_domain(domain) {
    let domain_status = await check_url('http://0.0.0.0:8090/site/', domain);
    return domain_status !== 'Bad';
  }

  let body = document.body.innerHTML;
  if (!site_has_ton_connect(body)) {
    return;
  }

  let domain = extractDomain(window.location.href);
  let isWhitelisted = await is_whitelisted_domain(domain);

  if (!isWhitelisted) {
    // Create a full-screen warning overlay
    let warningDiv = document.createElement('div');
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '0';
    warningDiv.style.left = '0';
    warningDiv.style.width = '100%';
    warningDiv.style.height = '100%';
    warningDiv.style.backgroundColor = '#D32F2F'; // Red color
    warningDiv.style.color = 'white';
    warningDiv.style.zIndex = '999999';
    warningDiv.style.display = 'flex';
    warningDiv.style.flexDirection = 'column';
    warningDiv.style.justifyContent = 'center';
    warningDiv.style.alignItems = 'center';
    warningDiv.style.textAlign = 'center';
    warningDiv.style.fontSize = '24px';
    warningDiv.style.fontFamily = 'Arial, sans-serif';
    warningDiv.style.padding = '20px';

    // Add warning text
    let warningText = document.createElement('h1');
    warningText.textContent = 'Warning: Unsafe Site Detected';
    warningText.style.fontSize = '36px';
    warningText.style.marginBottom = '20px';
    warningDiv.appendChild(warningText);

    let warningMessage = document.createElement('p');
    warningMessage.textContent =
      'This site is not whitelisted for TON Connect usage and may be unsafe.';
    warningDiv.appendChild(warningMessage);

    // Append the warning overlay to the body
    document.body.appendChild(warningDiv);
  }
}