// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    subscribeEnabled: true,
    waitTime: 5, // Default wait time in seconds
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    chrome.storage.sync.get(
      ["enabled", "subscribeEnabled", "waitTime"],
      (data) => {
        sendResponse({
          enabled: data.enabled,
          subscribeEnabled: data.subscribeEnabled,
          waitTime: data.waitTime || 5, // Default to 5 seconds if not set
        });
      }
    );
    return true; // Required for async sendResponse
  }
});
