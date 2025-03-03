let scriptContent = '';
export async function registerScript() {
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
          matches: ['*://*.reddit.com/*'],
          js: [{ code: scriptContent }],
        },
      ]);
      console.log('user script registered');
    }
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}
