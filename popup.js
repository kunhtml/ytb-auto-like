// When popup loads, get current status
document.addEventListener("DOMContentLoaded", () => {
  const enabledCheckbox = document.getElementById("enabled");
  const subscribeEnabledCheckbox = document.getElementById("subscribeEnabled");
  const waitTimeInput = document.getElementById("waitTime");

  // Get current status from storage
  chrome.storage.sync.get(
    ["enabled", "subscribeEnabled", "waitTime"],
    (data) => {
      enabledCheckbox.checked = data.enabled;
      subscribeEnabledCheckbox.checked = data.subscribeEnabled;
      waitTimeInput.value = data.waitTime || 5; // Default to 5 seconds if not set
    }
  );

  // Save changes when checkboxes are toggled
  enabledCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: enabledCheckbox.checked });
  });

  subscribeEnabledCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({
      subscribeEnabled: subscribeEnabledCheckbox.checked,
    });
  });

  // Save changes when wait time is changed
  waitTimeInput.addEventListener("change", () => {
    // Ensure the value is between 1 and 30
    let waitTime = parseInt(waitTimeInput.value);
    if (isNaN(waitTime) || waitTime < 1) waitTime = 1;
    if (waitTime > 30) waitTime = 30;

    // Update the input value if it was adjusted
    waitTimeInput.value = waitTime;

    // Save to storage
    chrome.storage.sync.set({ waitTime: waitTime });
  });
});
