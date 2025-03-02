'use strict';

console.log('[reddit] start');

const webResourceKey = '1';
const selectors = [
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'a',
  'img',
];

const containerSelectors = [
  'article',
  'div[data-testid*="post-unit"]',
  'li.highlight-list-item',
  'li[rpl][role="presentation"]',
  'details',
  'faceplate-tracker[source="search"][action="view"][noun="trending"]',
  'shreddit-post[post-title]',
];

let isObserveStarted = false;
let observer = null;

(async () => {
  let isBlocking = await chrome.runtime.sendMessage({
    type: 'GET_IS_CURRENT_DOMAIN_BLOCKING',
    data: webResourceKey,
  });

  const startScript = () => {
    if (isBlocking) {
      startBlocking();
      console.log('[reddit] startBlocking');
    } else {
      stopBlocking();
      console.log('[reddit] stopBlocking');
    }
  };

  async function startBlocking() {
    const targets = await getTargets();
    hideTargets({ targets });
    startObserber(targets);
    console.log('[reddit] targets', targets);
  }
  async function stopBlocking() {
    if (isObserveStarted) {
      observer.disconnect();
      isObserveStarted = false;
    }
    const observedTargets = document.querySelectorAll(
      '.silent-blocking-extension'
    );
    observedTargets.forEach(el => {
      el.classList.remove('silent-blocking-extension');
      el.removeAttribute('data-silent-blocking-extension');
    });
  }

  async function getTargets() {
    return await chrome.runtime.sendMessage({
      type: 'GET_TARGETS_BY_KEY',
      data: webResourceKey,
    });
  }

  function hideTargets({ targets }) {
    const targetElement = document.body;
    // const targetElement = element ? element : document.body;
    targets.forEach(target => {
      const elements = targetElement.querySelectorAll(selectors.join(','));
      elements.forEach(el => {
        const targetElement = getTargetContent({ el, target });

        if (targetElement) {
          targetElement.classList.add('silent-blocking-extension');
          targetElement.setAttribute('data-silent-blocking-extension', 'true');
        }
      });
    });
  }

  function startObserber(targets) {
    if (isObserveStarted) return;
    isObserveStarted = true;
    observer = new MutationObserver(mutations => {
      hideTargets({ targets });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function getTargetContent({ el, target }) {
    if (el.children.length) return null;
    const { target: targetValue, ignoreCase, removeBlock } = target;
    const elementText = el.textContent;
    const isMatch = ignoreCase
      ? elementText.toLowerCase().includes(targetValue.toLowerCase())
      : elementText.includes(targetValue);
    if (!isMatch) return null;

    const targetContent = removeBlock
      ? el.closest(containerSelectors.join(','))
      : el;
    console.log('[reddit] targetValue', targetValue);
    if (targetContent) {
      return targetContent;
    }
    return el;
  }

  startScript();

  chrome.runtime.onUserScriptMessage.addListener(
    async (request, sender, response) => {
      if (
        request.type === 'REINIT_BLOCKING' &&
        request.webResourceKey === webResourceKey
      ) {
        isBlocking = request.isBlocking;
        startScript();

        return response(true);
      }
    }
  );

  console.log('[reddit] isBlocking', isBlocking);
})();
