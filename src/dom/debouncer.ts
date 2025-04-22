export class Debouncer {
  private static timer: number | null = null;

  static set(callback: () => void, delay: number): () => void {
    return () => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(callback, delay);
    };
  }
}
