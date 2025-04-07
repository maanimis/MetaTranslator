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
import { sessionStorageService } from "../../storage";
import { registerMenuCommand } from "../../menu";

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
    if (!selectedText) return this.tooltip.hide();

    const position = this.selectionService.getSelectionPosition();
    if (!position) return;

    const cachedResult = sessionStorageService.get(selectedText, null);
    if (cachedResult)
      return this.tooltip.show(cachedResult, position.x, position.y);

    await this.fetchAndShowTranslation(selectedText, position);
  }

  private async fetchAndShowTranslation(
    selectedText: string,
    position: { x: number; y: number },
  ): Promise<void> {
    try {
      const translationResult = await this.translator.translate(selectedText);
      if (translationResult.translation === selectedText) return;

      const formattedText = this.formatter.format(translationResult);
      sessionStorageService.set(selectedText, formattedText);
      this.tooltip.show(formattedText, position.x, position.y);
    } catch (error: any) {
      this.tooltip.show(`Error: ${error}`, position.x, position.y);
    }
  }

  private registerLanguageMenu(): void {
    registerMenuCommand("Set Target Language", () => {
      const currentLang = this.languageStorage.getTargetLanguage();
      const input = prompt(
        "Enter target language (fa,en,fr,de,...):",
        currentLang,
      );

      if (input) {
        this.languageStorage.setTargetLanguage(input);
        ProgressUI.showQuick("[+]Refresh the page", {
          percent: 100,
          duration: 3000,
        });
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
