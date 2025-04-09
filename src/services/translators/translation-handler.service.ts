import { ITooltip } from "../../components/interfaces.components";
import { Debouncer } from "../../utils";
import { menuCommandSingleton, MenuKey } from "../menu";
import { sessionStorageSingleton } from "../storage/cache.storage";

import type {
  ITranslationHandler,
  ITranslator,
  ITranslationFormatter,
  ISelectionService,
} from "./interface.translators";
import { LanguageService } from "./language-storage.service";

class TranslationHandler implements ITranslationHandler {
  private readonly DEBOUNCE_DELAY = 300;
  private readonly debouncer = new Debouncer();

  constructor(
    private readonly tooltip: ITooltip,
    private readonly translator: ITranslator,
    private readonly formatter: ITranslationFormatter,
    private readonly selectionService: ISelectionService,
    private readonly progressUI = ProgressUI,
  ) {}

  public setupListeners(): void {
    document.addEventListener(
      "mouseup",
      this.debouncer.debounce(
        () => this.handleTextSelection(),
        this.DEBOUNCE_DELAY,
      ),
    );

    document.addEventListener("mousedown", () => this.tooltip.hide());
  }

  public registerLanguageMenu(): void {
    menuCommandSingleton.register(MenuKey.targetLang, () =>
      this.promptLanguageChange(),
    );
  }

  private promptLanguageChange(): void {
    const currentLang = LanguageService.getTargetLanguage();
    const input = prompt(
      "Enter target language (fa, en, fr, de, ...):",
      currentLang,
    );

    if (input) {
      LanguageService.setTargetLanguage(input);
      this.progressUI.showQuick("[+] Refresh the page", {
        percent: 100,
        duration: 3000,
      });
    }
  }

  public async handleTextSelection(): Promise<void> {
    this.showTooltip("...");
    const selectedText = this.selectionService.getSelectedText();
    if (!selectedText) {
      this.tooltip.hide();
      return;
    }

    const cached = sessionStorageSingleton.get(selectedText, null);

    cached
      ? this.showTooltip(cached)
      : this.fetchAndShowTranslation(selectedText);
  }

  private async fetchAndShowTranslation(text: string): Promise<void> {
    try {
      const result = await this.translator.translate(text);

      if (result.translation === text) return;

      const formatted = this.formatter.format(result);
      sessionStorageSingleton.set(text, formatted);

      this.showTooltip(formatted);
    } catch (error: any) {
      this.showTooltip(`Error: ${error}`);
    }
  }

  public showTooltip(content: string): boolean {
    const position = this.selectionService.getSelectionPosition();
    if (!position) return false;
    this.tooltip.show(content, position.x, position.y);
    return true;
  }
}

export { TranslationHandler };
