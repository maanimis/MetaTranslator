export class AutoClicker {
  static click(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.click();
    }
  }

  static doubleClick(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      const mouseEvent = new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(mouseEvent);
    }
  }

  static rightClick(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      const mouseEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(mouseEvent);
    }
  }
}
