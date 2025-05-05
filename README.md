# YouTube Auto Like & Video Speed Control Extension

A Chrome extension that automatically likes YouTube videos, subscribes to channels, and provides convenient video speed controls for YouTube and all other websites with videos.

## Features

- Automatically clicks the like button on YouTube videos
- Automatically subscribes to channels of videos you watch
- Provides simple on-screen video speed control buttons (< and > to adjust speed)
- Works on all YouTube video pages
- Universal video speed controls work on any website with videos
- Incremental speed adjustment (0.15 steps) for precise control
- Option to enable/disable all features independently
- Customizable wait time before clicking buttons
- Simple and lightweight

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and active

## Usage

- The extension will automatically like YouTube videos and subscribe to channels when you watch videos
- Speed control buttons appear when you hover over any video player and disappear when you move the mouse away
- YouTube speed controls and universal video controls can be enabled/disabled separately
- Each click on < or > adjusts the video speed by 0.15 (e.g., from 1.0x to 1.15x)
- Click on the extension icon in the toolbar to enable/disable any feature
- You can independently toggle auto-like, auto-subscribe, and both speed control features
- Adjust the wait time (1-30 seconds) to control how long the extension waits before clicking buttons
- When disabled, the extension will not automatically perform the corresponding actions

## Notes

- The auto-like and auto-subscribe features only work on YouTube video pages (URLs that contain `/watch`)
- The universal video speed controls work on any website with HTML5 video elements
- It will not like videos that you have already liked or disliked
- It will not subscribe to channels you are already subscribed to
- The extension respects your YouTube login status - it will like videos and subscribe to channels using your account when you're logged in
- Video speed settings are applied to all videos on the current page

## Privacy

This extension:

- Does not collect any user data
- Does not send any information to external servers
- Only interacts with YouTube's like, subscribe, and HTML5 video playback elements
- All settings are stored locally in your browser
