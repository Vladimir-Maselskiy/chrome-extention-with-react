export async function injectScript(tabId) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Vladimir-Maselskiy/chrome-extention-with-react/main/src/remote-files/test.js'
    );
    const scriptContent = await response.text();

    if (!scriptContent) return;

    chrome.scripting.executeScript({
      target: { tabId },
      func: scriptText => {
        if (!document.getElementById('injected-script')) {
          const script = document.createElement('script');
          script.id = 'injected-script';
          script.textContent = scriptText;
          document.head.appendChild(script);
        }
      },
      args: [scriptContent],
    });
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}
