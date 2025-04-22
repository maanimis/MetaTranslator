import debug from "debug";

const log = debug("app:waitForElement");

export function waitForElement<T extends Element = HTMLElement>(
  selector: string,
  timeout: number = 10_000,
): Promise<T | null> {
  return new Promise((resolve) => {
    const ELEMENT = document.querySelector<T>(selector);
    if (ELEMENT) {
      return resolve(ELEMENT);
    }

    log("can't find element for selector: %s [...]waiting", selector);

    const observer = new MutationObserver(() => {
      const ELEMENT = document.querySelector<T>(selector);
      if (ELEMENT) {
        log("element found!!");
        resolve(ELEMENT);
        observer.disconnect();
      }
    });

    if (timeout >= 0) {
      setTimeout(() => {
        log("timeout reached, element not found.");
        resolve(null); // Resolve with null if timeout is reached
        observer.disconnect(); // Disconnect the observer if the timeout occurs
      }, timeout);
    }

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
