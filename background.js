// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    chrome.storage.sync.get("enabled", (data) => {
      sendResponse({ enabled: data.enabled });
    });
    return true; // Required for async sendResponse
  }
});
