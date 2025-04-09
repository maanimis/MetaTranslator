import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { MenuKey, menuCommandSingleton } from "./services/menu";
import { GoogleTranslator } from "./services/translators/apibots/google/google.translator";
import { LocalStorageLanguageService } from "./services/translators/language-storage.service";
import { BrowserSelectionService } from "./services/translators/selection.service";
import { TranslationHandler } from "./services/translators/translation-handler.service";

async function main() {
  const languageStorage = new LocalStorageLanguageService();
  const selectionService = new BrowserSelectionService();
  const tooltip = new DOMTooltip();
  const translator = new GoogleTranslator(languageStorage);
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

  menuCommandSingleton.register(
    MenuKey.translateText,
    translationHandler.handleTextSelection,
  );
}

main().catch((e) => {
  console.log(e);
});
