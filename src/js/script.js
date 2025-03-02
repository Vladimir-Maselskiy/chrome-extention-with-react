(async () => {
  console.log('[content_script] Запущено');

  async function loadAndExecuteScript(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Помилка завантаження: ${response.status}`);
      const scriptText = await response.text();

      console.log('[content_script] Виконуємо отриманий скрипт...');
      eval(scriptText); // Виконуємо код у контексті content script
      console.log('[content_script] Скрипт виконано');
    } catch (error) {
      console.error('[content_script] Помилка:', error);
    }
  }

  // Викликаємо завантаження
  await loadAndExecuteScript(
    'https://raw.githubusercontent.com/Vladimir-Maselskiy/chrome-extention-with-react/main/src/remote-files/reddit.js'
  );
})();
