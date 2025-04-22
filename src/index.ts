import { DefaultFormatter } from "./components/default-formatter.component";
import { DOMTooltip } from "./components/tooltip.component";
import { GoogleTranslationFormatter } from "./components/translation-formatter.component";
import { Config } from "./config";
import { menuCommandService, MenuKey } from "./services/menu";
import { StorageKey } from "./services/storage";
import { gmStorageService } from "./services/storage/storage.service";
import { GeminiTranslator } from "./services/translators/apibots/google/gemini.translator";
import { GoogleTranslator } from "./services/translators/apibots/google/google.translator";
import {
  ITranslationFormatter,
  ITranslator,
} from "./services/translators/interface.translators";
import { BrowserSelectionService } from "./services/translators/selection.service";
import { TranslationHandler } from "./services/translators/translation-handler.service";
import debug from "debug";
import { TranslationModeValue } from "./targets/popups/interfaces.popup";
import { DomainParser } from "./dom";
import { isValidTargetKey, Targets } from "./targets/youtube";

//TODO: save raw text instead formated at storage
//TODO: add html at local
// TODO:

const log = debug("app:main");

interface TranslationService {
  translator: ITranslator;
  formatter: ITranslationFormatter;
}

interface TranslationServiceCreator {
  create(): TranslationService;
}

class GeminiTranslationService implements TranslationServiceCreator {
  create(): TranslationService {
    return {
      translator: new GeminiTranslator(),
      formatter: new DefaultFormatter(),
    };
  }
}

class GoogleTranslationService implements TranslationServiceCreator {
  create(): TranslationService {
    return {
      translator: new GoogleTranslator(),
      formatter: new GoogleTranslationFormatter(),
    };
  }
}

class TranslatorFactory {
  private static serviceCreators: Record<
    TranslationModeValue,
    TranslationServiceCreator
  > = {
    [TranslationModeValue.geminiApi]: new GeminiTranslationService(),
    [TranslationModeValue.google]: new GoogleTranslationService(),
  };

  static create(translationMode: TranslationModeValue): TranslationService {
    const creator =
      this.serviceCreators[translationMode] ||
      this.serviceCreators[TranslationModeValue.google];
    return creator.create();
  }

  static getCurrentTranslator(): TranslationService {
    const translationMode = gmStorageService.get<TranslationModeValue>(
      StorageKey.translationMode,
      TranslationModeValue.google,
    );
    return this.create(translationMode);
  }

  static registerService(
    mode: TranslationModeValue,
    creator: TranslationServiceCreator,
  ): void {
    this.serviceCreators[mode] = creator;
  }
}

class TranslationApplication {
  private logger = log.extend("TranslationApplication");
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
    this.handleTargets();
  }

  private setupEventListeners() {
    this.translationHandler.setupListeners();
  }

  private registerMenuCommands() {
    menuCommandService.register(
      MenuKey.translateText,
      this.translationHandler.handleTextSelection.bind(this.translationHandler),
    );

    menuCommandService.register(MenuKey.settings, () => {
      window.location.href = Config.settings;
    });

    menuCommandService.register(MenuKey.debugMode, () => {
      DebugModeHandler.toogle();
    });
  }

  private handleTargets() {
    const { name } = DomainParser.parse();
    if (isValidTargetKey(name)) {
      const target = Targets[name];
      target();
    }
  }
}

class DebugModeHandler {
  private static defaultValue = Config.isDebugMode;

  static init() {
    localStorage.debug = "app:*";
    const isEnable = gmStorageService.get(
      StorageKey.debugMode,
      this.defaultValue,
    );
    if (isEnable) {
      debug.enable("*");
    } else {
      debug.disable();
    }
  }

  static toogle() {
    if (debug.enabled("*")) {
      this.setOFF();
      alert("Disabled!!");
    } else {
      this.setON();
      alert("Enabled!!");
    }
  }

  private static setON() {
    gmStorageService.set(StorageKey.debugMode, true);
    debug.enable("*");
  }

  private static setOFF() {
    gmStorageService.set(StorageKey.debugMode, false);
    debug.disable();
  }
}

async function bootstrapApplication() {
  try {
    DebugModeHandler.init();
    const app = new TranslationApplication();
    app.initialize();
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
}

bootstrapApplication();
