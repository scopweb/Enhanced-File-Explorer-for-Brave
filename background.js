// Background script for Enhanced File Explorer
// Handles opening new windows for file:// URLs

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openFileUrl') {
    console.log('Background: Received request to open file URL:', message.url);

    // Validate file URL
    if (!message.url || !message.url.startsWith('file://')) {
      console.error('Background: Invalid file URL provided');
      sendResponse({ success: false, error: 'Invalid file URL' });
      return true;
    }

    // Create new window with the file URL
    chrome.windows.create({
      url: message.url,
      type: 'normal',
      focused: true,
      state: 'normal'
    }, (window) => {
      if (chrome.runtime.lastError) {
        console.error('Background: Error opening window:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Background: Successfully created window with ID:', window.id);
        sendResponse({ success: true, windowId: window.id });
      }
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Handle tab updates to ensure content script is injected in all pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Inject content script to handle dynamic content
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch((error) => {
      // Ignore errors for restricted pages or if already injected
      console.log('Could not inject content script:', error.message);
    });
  }
});

// Also inject when extension is installed/enabled
chrome.runtime.onInstalled.addListener(() => {
  // Get all existing tabs and inject content script
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('moz-extension://')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(() => {
          // Ignore errors for restricted pages
        });
      }
    });
  });
});