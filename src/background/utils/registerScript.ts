let scriptContent = '';
export async function registerScript(tabId: number) {
  try {
    if (scriptContent) return;
    const response = await fetch(
      'https://raw.githubusercontent.com/Vladimir-Maselskiy/chrome-extention-with-react/main/src/remote-files/redditUserScript.js'
    );
    scriptContent = await response.text();

    if (!scriptContent) return;

    const userScripts = await chrome.userScripts.getScripts({ ids: ['test'] });

    if (userScripts.length === 0) {
      chrome.userScripts.register([
        {
          id: 'test',
          matches: ['*://*/*'],
          js: [{ code: scriptContent }],
        },
      ]);
      console.log('user script registered');
    }

    // chrome.scripting.executeScript({
    //   target: { tabId },
    //   func: scriptText => {
    //     if (!document.getElementById('injected-script')) {
    //       const script = document.createElement('script');
    //       script.id = 'injected-script';
    //       script.textContent = scriptText;
    //       document.head.appendChild(script);
    //     }
    //   },
    //   args: [scriptContent],
    // });
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}
