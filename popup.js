// When popup loads, get current status
document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  
  // Get current status from storage
  chrome.storage.sync.get('enabled', (data) => {
    enabledCheckbox.checked = data.enabled;
  });
  
  // Save changes when checkbox is toggled
  enabledCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enabledCheckbox.checked });
  });
});
