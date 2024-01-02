
let isDivAdded = false;

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('webUrl', async function (result) {
    const urlFromContent = result.webUrl;
    console.log('Stored URL in popup.js:', urlFromContent);
  
    let summarizedResult;

    

  const extractButtonElement = document.querySelector('.extractButton');
 
  extractButtonElement.addEventListener('click', async () => {
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Loading...';
    loadingElement.style.fontWeight = 'bold';
    loadingElement.style.color = 'gray';
    document.body.appendChild(loadingElement);
    
    if (urlFromContent) {
      console.log('Current URL:', urlFromContent);

      const extractedUrl = 'https://article-data-extraction-and-summarization.p.rapidapi.com/article?url=' + urlFromContent;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd9dbf2e301msh5d6dedad3a3413ap177675jsne5af4b8838b3',
          'X-RapidAPI-Host': 'article-data-extraction-and-summarization.p.rapidapi.com'
        }
      };

      try {
        const extractedResponse = await fetch(extractedUrl, options);
        const extractedResult = await extractedResponse.json();
        const parsedText = extractedResult.article.text;
        const cleanedText = parsedText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('cleaned text:', cleanedText);

        const summarizedUrl = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4';
        const summarizedOptions = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'd9dbf2e301msh5d6dedad3a3413ap177675jsne5af4b8838b3',
          'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: cleanedText
            }
          ],
          system_prompt: 'Summarize this text',
          temperature: 0.5,
          top_k: 50,
          top_p: 0.9,
          max_tokens: 200,
          web_access: false
        })
        };

      try {
        loadingElement.textContent = 'Fetching summary...';

        const response = await fetch(summarizedUrl, summarizedOptions);
        summarizedResult = await response.json();
        console.log(summarizedResult.result);
        loadingElement.textContent = '';
      } catch (error) {
        console.error(error);
      }
      } catch (error) {
        console.error('Error in text extraction:', error);
      }
    if (!isDivAdded) {
      const newDiv = document.createElement('div');
      newDiv.style.backgroundColor = 'white';
      newDiv.style.padding = '4px';
      newDiv.style.border = '1px solid black';
      newDiv.style.borderRadius = '4px';
      newDiv.style.maxHeight = '200px';
      newDiv.style.overflowY = 'auto';
      newDiv.textContent = summarizedResult.result;
      document.body.appendChild(newDiv);
      isDivAdded = true;
    }
     } else {
      console.error('URL from content script not available.');
     }
    
});
});
})
