import { DefaultFormatter } from "./components/default-formatter.component";
import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { Config } from "./config";
import { TranslationModeValue } from "./popups/interfaces.popup";
import { TranslationSettings } from "./popups/settings/settings.popup";
import { menuCommandSingleton, MenuKey } from "./services/menu";
import { StorageKey } from "./services/storage";
import { gmStorageSingleton } from "./services/storage/storage.service";
import { GeminiTranslator } from "./services/translators/apibots/google/gemini.translator";
import { GoogleTranslator } from "./services/translators/apibots/google/google.translator";
import { BrowserSelectionService } from "./services/translators/selection.service";
import { TranslationHandler } from "./services/translators/translation-handler.service";

// Constants
const DEFAULT_TRANSLATION_MODE = TranslationModeValue.google;
const SETTINGS_PATH = Config.settings;

// Translator Factory - encapsulates translator creation logic
class TranslatorFactory {
  static create(translationMode: TranslationModeValue) {
    switch (translationMode) {
      case TranslationModeValue.geminiApi:
        return {
          translator: new GeminiTranslator(),
          formatter: new DefaultFormatter(),
        };
      default:
        return {
          translator: new GoogleTranslator(),
          formatter: new GoogleTranslationFormatter(),
        };
    }
  }

  static getCurrentTranslator() {
    const translationMode = gmStorageSingleton.get<TranslationModeValue>(
      StorageKey.translationMode,
      DEFAULT_TRANSLATION_MODE,
    );
    return this.create(translationMode);
  }
}

// Application Service - main coordination logic
class TranslationApplication {
  private selectionService: BrowserSelectionService;
  private tooltip: DOMTooltip;
  private translationHandler: TranslationHandler;

  constructor() {
    this.selectionService = new BrowserSelectionService();
    this.tooltip = new DOMTooltip();
    const { translator, formatter } = TranslatorFactory.getCurrentTranslator();

    this.translationHandler = new TranslationHandler(
      this.tooltip,
      translator,
      formatter,
      this.selectionService,
    );
  }

  initialize() {
    this.setupEventListeners();
    this.registerMenuCommands();
    this.handleSettingsPage();
  }

  private setupEventListeners() {
    this.translationHandler.setupListeners();
  }

  private registerMenuCommands() {
    menuCommandSingleton.register(
      MenuKey.translateText,
      this.translationHandler.handleTextSelection.bind(this.translationHandler),
    );

    menuCommandSingleton.register(MenuKey.settings, () => {
      window.location.href = SETTINGS_PATH;
    });
  }

  private handleSettingsPage() {
    if (window.location.href === SETTINGS_PATH) {
      new TranslationSettings().togglePopup();
    }
  }
}

// Main entry point with error handling
async function bootstrapApplication() {
  try {
    const app = new TranslationApplication();
    await app.initialize();
  } catch (error) {
    console.error("Application initialization failed:", error);
    // Consider adding error reporting here
  }
}

// Start the application
bootstrapApplication();

/*

import { DefaultFormatter } from "./components/default-formatter.component";
import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { Config } from "./config";
import { TranslationModeValue } from "./popups/interfaces.popup";
import { TranslationSettings } from "./popups/settings/settings.popup";
import { MenuKey, menuCommandSingleton } from "./services/menu";
import { StorageKey } from "./services/storage";
import { gmStorageSingleton } from "./services/storage/storage.service";
import { GeminiTranslator } from "./services/translators/apibots/google/gemini.translator";
import { GoogleTranslator } from "./services/translators/apibots/google/google.translator";
import { BrowserSelectionService } from "./services/translators/selection.service";
import { TranslationHandler } from "./services/translators/translation-handler.service";

function getTranslator() {
  const translationMode = gmStorageSingleton.get<TranslationModeValue>(
    StorageKey.translationMode,
    TranslationModeValue.google,
  );
  if (translationMode === TranslationModeValue.geminiApi) {
    return {
      translator: new GeminiTranslator(),
      formatter: new DefaultFormatter(),
    };
  }

  return {
    translator: new GoogleTranslator(),
    formatter: new GoogleTranslationFormatter(),
  };
}

async function main() {
  const url = location.href;
  const selectionService = new BrowserSelectionService();
  const tooltip = new DOMTooltip();
  const { translator, formatter } = getTranslator();

  const translationHandler = new TranslationHandler(
    tooltip,
    translator,
    formatter,
    selectionService,
  );
  translationHandler.setupListeners();
  // translationHandler.registerLanguageMenu();

  menuCommandSingleton.register(
    MenuKey.translateText,
    translationHandler.handleTextSelection,
  );
  menuCommandSingleton.register(MenuKey.settings, () => {
    location.href = Config.settings;
  });

  if (url === Config.settings) {
    const translationSettings = new TranslationSettings();
    translationSettings.togglePopup();
  }
}

main().catch((e) => {
  console.log(e);
});


*/
