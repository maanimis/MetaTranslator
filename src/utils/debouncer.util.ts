export class Debouncer {
  private timer: number | null = null;

  debounce(callback: () => void, delay: number): () => void {
    return () => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(callback, delay);
    };
  }
}
