// List of whitelisted URLs
const ton_connect_allowed_domains = new Set([
  "ston.fi"
]);

let ton_connect_str = new Set([
  "ton-connect",
  "tonconnect"
])

function site_has_ton_connect(site_body) {
  let site_lower = site_body.toLowerCase();
  for (let str of ton_connect_str) {
    if (site_lower.includes(str)) {
      return true;
    }
  }
}

function extractDomain(url) {
  const domain = url.match(/:\/\/(www\.)?(.[^/]+)/)[2];
  const domainParts = domain.split('.');
  const secondLevelDomain = domainParts.slice(-2).join('.');
  return secondLevelDomain;
}

function is_whitelisted_domain(domain) {
  return ton_connect_allowed_domains.has(domain);
}

function plugin_alert(tabId, text) {
  let text = text
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      alert(text);
    }
  });
}

function plugin_log(tabId, text) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      console.log(text);
    }
  });
}


  
// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        alert("text");
      }
    });

    // plugin_alert(tabId, "foo");
    // plugin_log(tabId, "bar");



    // chrome.extension.getBackgroundPage().console.log('foo');
      // chrome.scripting.executeScript({
    //   target: { tabId: tabId },
    //   func: () => document.body.innerHTML
    // }, (results) => {
    //   console.log("results", results);
    //   if (!results || !results[0]) {
    //     return;
    //   }
    //   if (!site_has_ton_connect(results[0])) {
    //     return;
    //   }
    //   let domain = extractDomain(tab.url);
    //   if (!is_whitelisted_domain(domain)) {
    //     alert("This site is not whitelisted for TON Connect usage");
    //   }
    // });
  }
});