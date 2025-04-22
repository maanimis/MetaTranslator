export class AutoScroller {
  static scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  static scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  static scrollTo(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
}
