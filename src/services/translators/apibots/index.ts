import { ITooltip } from "../../../components/interfaces.components";
import { DOMTooltip } from "../../../components/tooltip.component";
import { GoogleTranslationFormatter } from "../../../components/translation-formatter.component";
import { Debouncer } from "../../../utils";
import {
  ITranslator,
  ITranslationFormatter,
  ILanguageStorage,
} from "../interface.translators";
import { GoogleTranslator } from "./google/translator.google";
import { ISelectionService } from "./interfaces.apibots";
import { LocalStorageLanguageService } from "../language-storage.service";
import { BrowserSelectionService } from "../selection.service";

class TranslationHandler {
  private readonly DEBOUNCE_DELAY = 300;

  constructor(
    private tooltip: ITooltip,
    private translator: ITranslator,
    private formatter: ITranslationFormatter,
    private selectionService: ISelectionService,
    private languageStorage: ILanguageStorage,
  ) {
    this.initialize();
  }

  private initialize(): void {
    const debouncer = new Debouncer();

    document.addEventListener(
      "mouseup",
      debouncer.debounce(() => this.onTextSelect(), this.DEBOUNCE_DELAY),
    );

    document.addEventListener("mousedown", () => this.tooltip.hide());

    this.registerLanguageMenu();
  }

  private async onTextSelect(): Promise<void> {
    const selectedText = this.selectionService.getSelectedText();
    if (!selectedText) {
      this.tooltip.hide();
      return;
    }

    const position = this.selectionService.getSelectionPosition();
    if (!position) return;

    try {
      const translationResult = await this.translator.translate(selectedText);
      if (selectedText === translationResult.translation) return;
      const formattedText = this.formatter.format(translationResult);
      this.tooltip.show(formattedText, position.x, position.y);
    } catch (error: any) {
      this.tooltip.show(`Error: ${error}`, position.x, position.y);
    }
  }

  private registerLanguageMenu(): void {
    GM_registerMenuCommand("Set Target Language", () => {
      const currentLang = this.languageStorage.getTargetLanguage();
      const input = prompt(
        "Enter target language (fa,en,fr,de,...):",
        currentLang,
      );

      if (input) {
        this.languageStorage.setTargetLanguage(input);
        // alert(`Target language set to "${input}"`);
      }
    });
  }
}

// Composition Root
function initApiTranslation() {
  const languageStorage = new LocalStorageLanguageService();
  const targetLang = languageStorage.getTargetLanguage();
  const selectionService = new BrowserSelectionService();
  const tooltip = new DOMTooltip();
  const translator = new GoogleTranslator("auto", targetLang);
  const formatter = new GoogleTranslationFormatter();

  return new TranslationHandler(
    tooltip,
    translator,
    formatter,
    selectionService,
    languageStorage,
  );
}

export { initApiTranslation };
