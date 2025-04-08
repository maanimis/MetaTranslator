import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { registerMenuCommand } from "./services/menu";
import { TranslationHandler } from "./services/translators/apibots";
import { GoogleTranslator } from "./services/translators/apibots/google/translator.google";
import { LocalStorageLanguageService } from "./services/translators/language-storage.service";
import { BrowserSelectionService } from "./services/translators/selection.service";

async function main() {
  const languageStorage = new LocalStorageLanguageService();
  const targetLang = languageStorage.getTargetLanguage();
  const selectionService = new BrowserSelectionService();
  const tooltip = new DOMTooltip();
  const translator = new GoogleTranslator("auto", targetLang);
  const formatter = new GoogleTranslationFormatter();

  const translationHandler = new TranslationHandler(
    tooltip,
    translator,
    formatter,
    selectionService,
    languageStorage,
  );
  translationHandler.setupListeners();
  translationHandler.registerLanguageMenu();

  registerMenuCommand(
    "Translate Selected Text",
    translationHandler.handleTextSelection,
  );
}

main().catch((e) => {
  console.log(e);
});
