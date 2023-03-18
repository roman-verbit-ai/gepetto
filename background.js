chrome.action.onClicked.addListener((tab) => {
	alert(111);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["inject.js"]
  });
});

document.addEventListener('DOMContentLoaded', function() {
  alert('loaded2');
});