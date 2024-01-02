chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.url) {
      console.log('URL from content script:', request.url);
      
      chrome.storage.local.set({ webUrl: request.url });
    }
    
  
   
  });