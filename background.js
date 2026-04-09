// Track which tab was previously active for YouTube
let previousYouTubeTabId = null;

// Listen for tab activation events
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  // Check if the newly active tab is a YouTube tab
  if (tab.url && tab.url.includes("youtube.com")) {
    // Send play message to the active YouTube tab
    chrome.tabs.sendMessage(activeInfo.tabId, { action: "playVideo" }).catch(() => {
      // Tab might not have content script loaded yet
    });
    previousYouTubeTabId = activeInfo.tabId;
  } else if (previousYouTubeTabId) {
    // If switching away from YouTube, pause the video in the previous YouTube tab
    chrome.tabs.sendMessage(previousYouTubeTabId, { action: "pauseVideo" }).catch(() => {
      // Tab might be closed or unreachable
    });
    previousYouTubeTabId = null;
  }
});

// Also handle when a window loses focus (tab becomes inactive)
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome window lost focus, pause any active YouTube video
    if (previousYouTubeTabId) {
      chrome.tabs.sendMessage(previousYouTubeTabId, { action: "pauseVideo" }).catch(() => {
        // Tab might be closed or unreachable
      });
    }
  } else {
    // Chrome window gained focus, play the video in the active YouTube tab
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url.includes("youtube.com")) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "playVideo" }).catch(() => {
          // Tab might not have content script loaded yet
        });
        previousYouTubeTabId = tabs[0].id;
      }
    });
  }
});
