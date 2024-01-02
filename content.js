const currentUrl = window.location.href;

chrome.runtime.sendMessage({ url: currentUrl });