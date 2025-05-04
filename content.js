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

// Main function to run when page loads
function main() {
  console.log("YouTube Auto Like: Checking if we are on a video page...");

  // Only proceed if we're on a video page
  if (!isVideoPage()) {
    console.log("Not a video page, skipping auto-like");
    return;
  }

  console.log(
    "YouTube Auto Like: On a video page, checking if extension is enabled..."
  );

  // Check if extension is enabled
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    if (response && response.enabled) {
      console.log(
        "YouTube Auto Like: Extension is enabled, waiting for page to load..."
      );

      // Wait longer for the page to fully load (5 seconds)
      setTimeout(() => {
        console.log(
          "YouTube Auto Like: Page should be loaded, attempting to like video..."
        );
        clickLikeButton();
      }, 5000);
    } else {
      console.log("YouTube Auto Like: Extension is disabled");
    }
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

    // Wait a bit before running main to ensure the page has started loading
    setTimeout(main, 1000);
  }
});

// Start observing the document with the configured parameters
urlChangeObserver.observe(document, { subtree: true, childList: true });

// Also listen for YouTube's navigation events which are more reliable for SPA navigation
document.addEventListener("yt-navigate-finish", () => {
  console.log("YouTube Auto Like: yt-navigate-finish event detected");
  setTimeout(main, 1000);
});

// Log that the extension is loaded
console.log("YouTube Auto Like extension loaded successfully!");
