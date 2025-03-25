import { ISelectionService } from "./apibots/interfaces.apibots";

export class BrowserSelectionService implements ISelectionService {
  private readonly TOOLTIP_OFFSET_Y = 40;

  getSelectedText(): string | null {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    return text || null;
  }

  getSelectionPosition(): { x: number; y: number } | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - this.TOOLTIP_OFFSET_Y,
    };
  }
}
