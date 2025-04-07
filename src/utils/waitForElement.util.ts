export function waitForElement<T extends Element = HTMLElement>(
  selector: string,
  timeout: number = -1,
): Promise<T | null> {
  return new Promise((resolve) => {
    const ELEMENT = document.querySelector<T>(selector);
    if (ELEMENT) {
      return resolve(ELEMENT);
    }

    console.log("can't find element for selector:", selector, "waiting...");

    const observer = new MutationObserver(() => {
      const ELEMENT = document.querySelector<T>(selector);
      if (ELEMENT) {
        console.log("element found!!");
        resolve(ELEMENT);
        observer.disconnect();
      }
    });

    if (timeout !== -1) {
      setTimeout(() => {
        console.log("timeout reached, element not found.");
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
