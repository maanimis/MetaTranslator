import { ITooltip } from "../../components/interfaces.components";
import { Debouncer } from "../../utils";
import { menuCommandService, MenuKey } from "../menu";
import { IStorageService } from "../storage";
import { sessionStorageService } from "../storage/cache.storage";
import type {
  ITranslationHandler,
  ITranslator,
  ITranslationFormatter,
  ISelectionService,
} from "./interface.translators";
import { LanguageService } from "./language-storage.service";
import debug from "debug";

const log = debug("app:TranslationHandler");

class TranslationHandler implements ITranslationHandler {
  // private storageSerivce:IStorageService=gmStorageService
  private cacheSerivce: IStorageService = sessionStorageService;
  private readonly progressUI = ProgressUI;
  private readonly debouncer = new Debouncer();
  private readonly DEBOUNCE_DELAY = 300;

  constructor(
    private readonly tooltip: ITooltip,
    private readonly translator: ITranslator,
    private readonly formatter: ITranslationFormatter,
    private readonly selectionService: ISelectionService,
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
    log("register menu: %s", MenuKey.targetLang);
    menuCommandService.register(MenuKey.targetLang, () =>
      this.promptLanguageChange(),
    );
  }

  private promptLanguageChange(): void {
    const currentLang = LanguageService.getTargetLanguage();
    log("currentLang: %s", currentLang);

    const input = prompt(
      "Enter target language (fa, en, fr, de, ...):",
      currentLang,
    );

    log("prompt value: %s", input);

    if (input) {
      LanguageService.setTargetLanguage(input);
      this.progressUI.showQuick("[+] Refresh the page", {
        percent: 100,
        duration: 3000,
      });
    }
  }

  public async handleTextSelection(): Promise<void> {
    log("loading...");
    this.showTooltip("...");
    const selectedText = this.selectionService.getSelectedText();
    if (!selectedText) {
      this.tooltip.hide();
      return;
    }

    const cached = this.cacheSerivce.get(selectedText, null);

    if (cached) {
      log("getting from cache...");
      this.showTooltip(cached);
    } else {
      log("getting from request...");

      this.fetchAndShowTranslation(selectedText);
    }
  }

  private async fetchAndShowTranslation(text: string): Promise<void> {
    try {
      const result = await this.translator.translate(text);

      if (result.translation === text) {
        log("same text detected!!");
        this.tooltip.hide();

        return;
      }

      const formatted = this.formatter.format(result);
      this.cacheSerivce.set(text, formatted);

      this.showTooltip(formatted);
    } catch (error: any) {
      this.showTooltip(`Error: ${error}`);
    }
  }

  public showTooltip(content: string): boolean {
    let result: boolean = true;

    const position = this.selectionService.getSelectionPosition();
    if (position) {
      this.tooltip.show(content, position.x, position.y);
    } else {
      result = false;
    }

    return result;
  }
}

export { TranslationHandler };
