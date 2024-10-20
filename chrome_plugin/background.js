chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      files: ['content.js'],
    })
    .catch((err) => console.error(err));
});