chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["inject.js"]
  });
});

chrome.webNavigation.onHistoryStateUpdated.addListener( function () {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["inject.js"]
    
  })
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["inject.js"]
    });
  }
});