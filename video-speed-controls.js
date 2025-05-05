// Universal Video Speed Controls
console.log("Universal Video Speed Controls loaded");

// Track if we've already set up speed controls for the current page
let speedControlsSetup = false;

// Function to create and manage speed control buttons for any video
function setupUniversalSpeedControls() {
  // Check if speed controls already exist
  if (document.getElementById("universal-speed-controls")) {
    return; // Speed controls already exist
  }

  console.log("Setting up universal speed control buttons...");

  // Create the speed control container
  const speedControlsContainer = document.createElement("div");
  speedControlsContainer.id = "universal-speed-controls";
  speedControlsContainer.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 2147483647; /* Maximum z-index value */
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: auto;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    font-family: Arial, sans-serif;
    user-select: none;
  `;

  // Speed increment value
  const speedIncrement = 0.15;

  // Create decrease speed button
  const decreaseButton = document.createElement("button");
  decreaseButton.textContent = "<";
  decreaseButton.style.cssText = `
    background-color: transparent;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin: 0;
    transition: background-color 0.2s ease;
  `;

  // Create speed display
  const speedDisplay = document.createElement("span");
  speedDisplay.id = "universal-speed-display";
  speedDisplay.style.cssText = `
    color: white;
    font-size: 12px;
    margin: 0 5px;
    min-width: 40px;
    text-align: center;
  `;

  // Create increase speed button
  const increaseButton = document.createElement("button");
  increaseButton.textContent = ">";
  increaseButton.style.cssText = `
    background-color: transparent;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin: 0;
    transition: background-color 0.2s ease;
  `;

  // Function to update speed display
  function updateSpeedDisplay(speed) {
    speedDisplay.textContent = speed.toFixed(2) + "x";
  }

  // Function to find all video elements on the page
  function findVideos() {
    return document.querySelectorAll("video");
  }

  // Function to change speed for all videos
  function changeAllVideosSpeed(newSpeed) {
    const videos = findVideos();
    if (videos.length > 0) {
      videos.forEach((video) => {
        video.playbackRate = newSpeed;
      });
      updateSpeedDisplay(newSpeed);
      console.log(
        `Changed playback speed to ${newSpeed}x for ${videos.length} videos`
      );
    }
  }

  // Get current speed (from the first video found)
  function getCurrentSpeed() {
    const videos = findVideos();
    if (videos.length > 0) {
      return videos[0].playbackRate;
    }
    return 1.0; // Default speed
  }

  // Decrease speed button click handler
  decreaseButton.addEventListener("click", () => {
    const currentSpeed = getCurrentSpeed();
    // Ensure speed doesn't go below 0.1
    const newSpeed = Math.max(0.1, currentSpeed - speedIncrement);
    changeAllVideosSpeed(newSpeed);
  });

  // Increase speed button click handler
  increaseButton.addEventListener("click", () => {
    const currentSpeed = getCurrentSpeed();
    // Cap speed at 5x to prevent extreme speeds
    const newSpeed = Math.min(5, currentSpeed + speedIncrement);
    changeAllVideosSpeed(newSpeed);
  });

  // Hover effects
  decreaseButton.addEventListener("mouseover", () => {
    decreaseButton.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  });

  decreaseButton.addEventListener("mouseout", () => {
    decreaseButton.style.backgroundColor = "transparent";
  });

  increaseButton.addEventListener("mouseover", () => {
    increaseButton.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  });

  increaseButton.addEventListener("mouseout", () => {
    increaseButton.style.backgroundColor = "transparent";
  });

  // Add elements to container
  speedControlsContainer.appendChild(decreaseButton);
  speedControlsContainer.appendChild(speedDisplay);
  speedControlsContainer.appendChild(increaseButton);

  // Add the container to the document body
  document.body.appendChild(speedControlsContainer);

  // Set initial speed display
  updateSpeedDisplay(getCurrentSpeed());

  // Show controls when hovering over them
  speedControlsContainer.addEventListener("mouseenter", () => {
    speedControlsContainer.style.opacity = "1";
  });

  // Make controls visible when any video is hovered
  function setupVideoHoverListeners() {
    const videos = findVideos();
    videos.forEach((video) => {
      // Don't modify the DOM structure, just add event listeners to the video
      if (!video.hasAttribute("data-speed-controls-attached")) {
        // Mark the video as having listeners attached
        video.setAttribute("data-speed-controls-attached", "true");

        // Add hover listeners directly to the video
        video.addEventListener("mouseenter", () => {
          // Position the controls near the video
          const videoRect = video.getBoundingClientRect();
          speedControlsContainer.style.position = "fixed";
          speedControlsContainer.style.top = `${videoRect.top + 10}px`;
          speedControlsContainer.style.left = `${videoRect.left + 10}px`;

          // Show the controls
          speedControlsContainer.style.opacity = "1";
        });

        // Add a small delay before hiding to make it easier to reach the controls
        let hideTimeout;

        video.addEventListener("mouseleave", (e) => {
          // Check if we're moving toward the controls
          const rect = speedControlsContainer.getBoundingClientRect();
          const isMovingTowardControls =
            e.clientX >= rect.left - 20 &&
            e.clientX <= rect.right + 20 &&
            e.clientY >= rect.top - 20 &&
            e.clientY <= rect.bottom + 20;

          if (isMovingTowardControls) {
            // Don't hide if moving toward controls
            clearTimeout(hideTimeout);
          } else {
            // Hide after a short delay
            hideTimeout = setTimeout(() => {
              speedControlsContainer.style.opacity = "0";
            }, 500);
          }
        });
      }
    });
  }

  // Initial setup of video hover listeners
  setupVideoHoverListeners();

  // Periodically check for new videos
  setInterval(() => {
    setupVideoHoverListeners();
  }, 2000);

  // Hide controls when clicking elsewhere on the page
  document.addEventListener("click", (e) => {
    if (!speedControlsContainer.contains(e.target)) {
      const videos = findVideos();
      let clickedOnVideo = false;

      videos.forEach((video) => {
        if (video.contains(e.target)) {
          clickedOnVideo = true;
        }
      });

      if (!clickedOnVideo) {
        speedControlsContainer.style.opacity = "0";
      }
    }
  });

  // Add listener to the controls to prevent hiding when hovering over them
  speedControlsContainer.addEventListener("mouseenter", () => {
    speedControlsContainer.style.opacity = "1";
  });

  speedControlsContainer.addEventListener("mouseleave", () => {
    speedControlsContainer.style.opacity = "0";
  });

  console.log("Universal speed control buttons added successfully!");
  speedControlsSetup = true;
}

// Function to check if the page has videos and if the feature is enabled
function checkForVideos() {
  chrome.storage.sync.get(["universalSpeedControlEnabled"], (data) => {
    const isEnabled =
      data.universalSpeedControlEnabled !== undefined
        ? data.universalSpeedControlEnabled
        : true;

    if (isEnabled) {
      const videos = document.querySelectorAll("video");
      if (videos.length > 0 && !speedControlsSetup) {
        setupUniversalSpeedControls();
      }
    } else if (speedControlsSetup) {
      // Remove controls if they exist but feature is disabled
      const controls = document.getElementById("universal-speed-controls");
      if (controls) {
        controls.remove();

        // Clean up any attributes we added to videos
        const videos = document.querySelectorAll(
          "video[data-speed-controls-attached]"
        );
        videos.forEach((video) => {
          video.removeAttribute("data-speed-controls-attached");
        });

        speedControlsSetup = false;
        console.log("Universal speed controls removed (feature disabled)");
      }
    }
  });
}

// Check for videos when the page loads
window.addEventListener("load", () => {
  checkForVideos();

  // Also check periodically for dynamically added videos
  setInterval(checkForVideos, 3000);
});

// Check for videos when DOM changes
const observer = new MutationObserver(() => {
  checkForVideos();
});

// Start observing the document
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Check immediately in case videos are already present
checkForVideos();
