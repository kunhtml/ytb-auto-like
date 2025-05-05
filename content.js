// Function to check if we're on a YouTube video page
function isVideoPage() {
  return window.location.pathname === "/watch";
}

// Function to find and click the like button
function clickLikeButton() {
  console.log("Attempting to find and click the like button...");

  // Wait for the like button to be available
  const checkForLikeButton = setInterval(() => {
    // Try multiple selectors to find the like button
    // YouTube's DOM structure can change, so we try several possible selectors
    const possibleSelectors = [
      // Modern YouTube selectors
      'ytd-menu-renderer button[aria-label^="like" i]:not([aria-label*="dislike" i])',
      "ytd-menu-renderer ytd-toggle-button-renderer:first-child button",
      'ytd-menu-renderer ytd-like-button-renderer button[aria-pressed="false"]',
      "ytd-menu-renderer like-button-view-model button",
      // Older YouTube selectors
      'ytd-video-primary-info-renderer button[aria-label^="like" i]:not([aria-label*="dislike" i])',
      'ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text[aria-label^="like this"]',
      // Generic approach - first button in the like/dislike container
      "#top-level-buttons-computed > ytd-toggle-button-renderer:first-child button",
      "#top-level-buttons > ytd-toggle-button-renderer:first-child button",
      // Mobile YouTube
      "button.ytm-like-button-renderer",
    ];

    let likeButton = null;

    // Try each selector until we find a match
    for (const selector of possibleSelectors) {
      const button = document.querySelector(selector);
      if (button) {
        likeButton = button;
        console.log("Found like button with selector:", selector);
        break;
      }
    }

    // If we found a button
    if (likeButton) {
      clearInterval(checkForLikeButton);

      // Try to determine if the video is already liked
      const isLiked =
        likeButton.getAttribute("aria-pressed") === "true" ||
        likeButton.classList.contains("yt-spec-button-shape-next--toggled") ||
        likeButton.querySelector(
          'path[d^="M3,11h10v2H3V11z M3,5h10v2H3V5z M3,17h7v2H3V17z"]'
        );

      if (!isLiked) {
        console.log("Auto-liking YouTube video...");
        likeButton.click();

        // Log success message
        console.log("Like button clicked successfully!");
      } else {
        console.log("Video is already liked");
      }
    } else {
      console.log("Still searching for like button...");
    }
  }, 1000); // Check every second

  // Stop checking after 30 seconds to avoid infinite loops
  setTimeout(() => {
    clearInterval(checkForLikeButton);
    console.log("Stopped searching for like button after timeout");
  }, 30000);
}

// Track if we've already subscribed to the current channel
let hasSubscribedToCurrentChannel = false;

// Function to find and click the subscribe button
function clickSubscribeButton() {
  // If we've already subscribed to this channel in this session, don't try again
  if (hasSubscribedToCurrentChannel) {
    console.log(
      "Already attempted to subscribe to this channel in this session, skipping"
    );
    return;
  }

  console.log("Attempting to find and check the subscribe button status...");

  // Wait for the subscribe button to be available
  const checkForSubscribeButton = setInterval(() => {
    // First, check if there's any "Unsubscribe" confirmation dialog visible
    const unsubscribeDialog = document.querySelector(
      "tp-yt-paper-dialog:not([hidden])"
    );
    if (
      unsubscribeDialog &&
      (unsubscribeDialog.textContent.includes("Unsubscribe") ||
        unsubscribeDialog.textContent.includes("Hủy đăng ký"))
    ) {
      console.log("Unsubscribe confirmation dialog detected, closing it");
      // Find the cancel button (usually the left button in the dialog)
      const cancelButton = unsubscribeDialog.querySelector(
        "button:first-of-type, .cancel-button, yt-button-renderer:first-of-type button"
      );
      if (cancelButton) {
        cancelButton.click();
        console.log("Clicked cancel button on unsubscribe dialog");
      }
      clearInterval(checkForSubscribeButton);
      hasSubscribedToCurrentChannel = true; // Mark as handled to prevent further attempts
      return;
    }

    // Try multiple selectors to find the subscribe button
    // YouTube's DOM structure can change, so we try several possible selectors
    const possibleSelectors = [
      // Modern YouTube selectors
      "ytd-subscribe-button-renderer button",
      "#subscribe-button button",
      "#subscribe-button ytd-subscribe-button-renderer button",
      "ytd-channel-name + ytd-subscribe-button-renderer button",
      // Older YouTube selectors
      "paper-button.ytd-subscribe-button-renderer",
      // Mobile YouTube
      "button.ytm-subscribe-button-renderer",
      // Generic approach
      'button[aria-label^="Subscribe" i]',
      'button[aria-label^="Đăng ký" i]', // Vietnamese
      'button:has(span:contains("Subscribe"))',
      'button:has(span:contains("Đăng ký"))', // Vietnamese
    ];

    let subscribeButton = null;

    // Try each selector until we find a match
    for (const selector of possibleSelectors) {
      const button = document.querySelector(selector);
      if (button) {
        subscribeButton = button;
        console.log("Found subscribe button with selector:", selector);
        break;
      }
    }

    // If we found a button
    if (subscribeButton) {
      clearInterval(checkForSubscribeButton);

      // More thorough check to determine if already subscribed
      const buttonText = subscribeButton.textContent?.toLowerCase() || "";
      const ariaLabel =
        subscribeButton.getAttribute("aria-label")?.toLowerCase() || "";

      // Check for various indicators that we're already subscribed
      const isSubscribed =
        ariaLabel.includes("unsubscribe") ||
        ariaLabel.includes("hủy đăng ký") || // Vietnamese
        buttonText.includes("unsubscribe") ||
        buttonText.includes("hủy đăng ký") || // Vietnamese
        buttonText.includes("subscribed") ||
        buttonText.includes("đã đăng ký") || // Vietnamese
        subscribeButton.classList.contains("subscribed") ||
        subscribeButton.getAttribute("subscribed") === "true" ||
        // Check for visual indicators (YouTube often uses these classes for the subscribed state)
        subscribeButton.classList.contains(
          "yt-spec-button-shape-next--toggled"
        ) ||
        // Check parent elements for subscription status
        subscribeButton.closest('[subscribed="true"]') !== null;

      console.log("Button text:", buttonText);
      console.log("Aria label:", ariaLabel);
      console.log("Is already subscribed:", isSubscribed);

      if (!isSubscribed) {
        console.log("Auto-subscribing to YouTube channel...");

        // Mark that we've subscribed to this channel to prevent multiple clicks
        hasSubscribedToCurrentChannel = true;

        // Click the subscribe button
        subscribeButton.click();

        // Log success message
        console.log("Subscribe button clicked successfully!");
      } else {
        console.log(
          "Already subscribed to this channel, skipping auto-subscribe"
        );
        hasSubscribedToCurrentChannel = true; // Mark as handled
      }
    } else {
      console.log("Still searching for subscribe button...");
    }
  }, 1000); // Check every second

  // Stop checking after 30 seconds to avoid infinite loops
  setTimeout(() => {
    clearInterval(checkForSubscribeButton);
    console.log("Stopped searching for subscribe button after timeout");
  }, 30000);
}

// Main function to run when page loads
function main() {
  console.log("YouTube Auto Like: Checking if we are on a video page...");

  // Only proceed if we're on a video page
  if (!isVideoPage()) {
    console.log("Not a video page, skipping auto-like and auto-subscribe");
    return;
  }

  console.log(
    "YouTube Auto Like: On a video page, checking if extension features are enabled..."
  );

  // Check if extension features are enabled
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    // Get the wait time from settings (convert to milliseconds)
    const waitTimeMs =
      (response && response.waitTime ? response.waitTime : 5) * 1000;

    console.log(
      `YouTube Auto Like: Waiting ${
        waitTimeMs / 1000
      } seconds for page to load...`
    );

    // Wait for the page to fully load based on user settings
    setTimeout(() => {
      // Check if auto-like is enabled
      if (response && response.enabled) {
        console.log(
          "YouTube Auto Like: Auto-like is enabled, attempting to like video..."
        );
        clickLikeButton();
      } else {
        console.log("YouTube Auto Like: Auto-like is disabled");
      }

      // Check if auto-subscribe is enabled
      if (response && response.subscribeEnabled) {
        console.log(
          "YouTube Auto Like: Auto-subscribe is enabled, attempting to subscribe to channel..."
        );
        clickSubscribeButton();
      } else {
        console.log("YouTube Auto Like: Auto-subscribe is disabled");
      }
    }, waitTimeMs);
  });
}

// Run main function when page loads
main();

// Also run when navigation happens within YouTube (without full page reload)
let lastUrl = location.href;
const urlChangeObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    console.log(
      "YouTube Auto Like: URL changed from",
      lastUrl,
      "to",
      location.href
    );
    lastUrl = location.href;

    // Reset the subscription flag when navigating to a new page
    hasSubscribedToCurrentChannel = false;

    // Wait a bit before running main to ensure the page has started loading
    setTimeout(main, 1000);
  }
});

// Start observing the document with the configured parameters
urlChangeObserver.observe(document, { subtree: true, childList: true });

// Also listen for YouTube's navigation events which are more reliable for SPA navigation
document.addEventListener("yt-navigate-finish", () => {
  console.log("YouTube Auto Like: yt-navigate-finish event detected");
  // Reset the subscription flag when YouTube navigation event occurs
  hasSubscribedToCurrentChannel = false;
  setTimeout(main, 1000);
});

// Log that the extension is loaded
console.log("YouTube Auto Like extension loaded successfully!");
