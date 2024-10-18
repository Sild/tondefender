// List of whitelisted URLs
const whitelist_domains = new Set([
  "ston.fi"
]);

function extractDomain(url) {
  const domain = url.match(/:\/\/(www\.)?(.[^/]+)/)[2];
  return domain;
}
  
// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    let domain = extractDomain(tab.url);
    if (whitelist_domains.has(domain)) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          alert("You have visited a whitelisted URL.");
        }
      });
    }
  }
});