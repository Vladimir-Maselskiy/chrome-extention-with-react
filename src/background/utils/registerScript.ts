export async function registerScript(tabId: number) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Vladimir-Maselskiy/chrome-extention-with-react/main/src/remote-files/userScript.js'
    );
    const scriptContent = await response.text();

    if (!scriptContent) return;

    chrome.userScripts.register([
      {
        id: 'test',
        matches: ['*://*/*'],
        js: [{ code: scriptContent }],
      },
    ]);

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
