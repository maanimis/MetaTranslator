import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { MenuKey, registerMenuCommand } from "./services/menu";
import { TranslationHandler } from "./services/translators/apibots";
import { GoogleTranslator } from "./services/translators/apibots/google/translator.google";
import { LocalStorageLanguageService } from "./services/translators/language-storage.service";
import { BrowserSelectionService } from "./services/translators/selection.service";

async function main() {
  const languageStorage = new LocalStorageLanguageService();
  const targetLang = languageStorage.getTargetLanguage();
  const sourceLang = languageStorage.getSourceLanguage();
  const selectionService = new BrowserSelectionService();
  const tooltip = new DOMTooltip();
  const translator = new GoogleTranslator(sourceLang, targetLang);
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
    MenuKey.translateText,
    translationHandler.handleTextSelection,
  );
}

main().catch((e) => {
  console.log(e);
});
