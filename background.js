// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    subscribeEnabled: true,
    waitTime: 5, // Default wait time in seconds
    speedControlEnabled: true, // Enable YouTube speed control buttons by default
    universalSpeedControlEnabled: true, // Enable universal speed control buttons by default
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    chrome.storage.sync.get(
      [
        "enabled",
        "subscribeEnabled",
        "waitTime",
        "speedControlEnabled",
        "universalSpeedControlEnabled",
      ],
      (data) => {
        sendResponse({
          enabled: data.enabled,
          subscribeEnabled: data.subscribeEnabled,
          waitTime: data.waitTime || 5, // Default to 5 seconds if not set
          speedControlEnabled:
            data.speedControlEnabled !== undefined
              ? data.speedControlEnabled
              : true, // Default to true if not set
          universalSpeedControlEnabled:
            data.universalSpeedControlEnabled !== undefined
              ? data.universalSpeedControlEnabled
              : true, // Default to true if not set
        });
      }
    );
    return true; // Required for async sendResponse
  }
});
