// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pauseVideo") {
    pauseVideo();
    sendResponse({ status: "paused" });
  } else if (request.action === "playVideo") {
    playVideo();
    sendResponse({ status: "playing" });
  }
});

function pauseVideo() {
  // Find the main YouTube video player
  const video = document.querySelector("video");
  if (video) {
    video.pause();
    console.log("YouTube video paused (tab inactive)");
  }
}

function playVideo() {
  // Find the main YouTube video player
  const video = document.querySelector("video");
  if (video) {
    video.play();
    console.log("YouTube video playing (tab active)");
  }
}
