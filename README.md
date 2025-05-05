# YouTube Auto Extension

A Chrome extension that automatically likes YouTube videos and subscribes to channels as you watch them.

## Features

- Automatically clicks the like button on YouTube videos
- Automatically subscribes to channels of videos you watch
- Works on all YouTube video pages
- Option to enable/disable both auto-like and auto-subscribe functionality
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
- Click on the extension icon in the toolbar to enable/disable the auto-like and auto-subscribe functionality
- You can independently toggle auto-like and auto-subscribe features
- Adjust the wait time (1-30 seconds) to control how long the extension waits before clicking buttons
- When disabled, the extension will not automatically perform the corresponding actions

## Notes

- The extension only works on YouTube video pages (URLs that contain `/watch`)
- It will not like videos that you have already liked or disliked
- It will not subscribe to channels you are already subscribed to
- The extension respects your YouTube login status - it will like videos and subscribe to channels using your account when you're logged in

## Privacy

This extension:

- Does not collect any user data
- Does not send any information to external servers
- Only interacts with YouTube's like and subscribe buttons
- All settings are stored locally in your browser
