// List of whitelisted URLs
const whitelist = [
    "https://www.example.com"
  ];
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      for (let i = 0; i < whitelist.length; i++) {
        if (tab.url.startsWith(whitelist[i])) {
          // Inject script to display alert
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
              alert("You have visited a whitelisted URL.");
            }
          });
          break;
        }
      }
    }
  });