chrome.action.onClicked.addListener((tab) => execScript(tab.id));
chrome.webNavigation.onHistoryStateUpdated.addListener((tab) => execScript(tab.id));
chrome.tabs.onUpdated.addListener( function (_, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    execScript(tab.id);
  }
});

function execScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["inject.js"]
  });
}