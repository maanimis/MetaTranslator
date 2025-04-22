import { ISelectionService } from "./interface.translators";
import debug from "debug";

const log = debug("app:selection");

export class BrowserSelectionService implements ISelectionService {
  private readonly TOOLTIP_OFFSET_Y = 40;

  getSelectedText(): string | null {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    const result = text || null;
    log("text: %s", result);
    return result;
  }

  getSelectionPosition(): { x: number; y: number } | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const result = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - this.TOOLTIP_OFFSET_Y,
    };
    log("position: %o", result);
    return result;
  }
}
