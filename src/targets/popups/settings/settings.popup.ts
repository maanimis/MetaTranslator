import {
  ElementCollection,
  TranslationConfig,
  TranslationModeValue,
} from "../interfaces.popup";
import debug from "debug";
import { StorageKey, IStorage } from "../../../services/storage";
import { LanguageService } from "../../../services/translators/language-storage.service";
import { gmStorageService } from "../../../services/storage/storage.service";

const log = debug("app:popup");

class SettingsStorage {
  // private static logger=log.extend("SettingsStorage")
  private static languageService = LanguageService;

  public static saveLanguage(language: string): void {
    this.languageService.setTargetLanguage(language);
    // this.logger('setLanguage: %s',language)
  }

  public static getLanguage(): string {
    const result = this.languageService.getTargetLanguage();
    // this.logger('getLanguage: %s',result)

    return result;
  }

  public static saveMode(mode: TranslationModeValue): void {
    gmStorageService.set(StorageKey.translationMode, mode);
    // this.logger('setTranslationMode: %s',mode)
  }

  public static getMode(): TranslationModeValue {
    const result = gmStorageService.get(
      StorageKey.translationMode,
      TranslationModeValue.google,
    );
    // this.logger('getTranslationMode: %s',result)
    return result;
  }

  public static saveApiToken(service: keyof IStorage, token: string): void {
    // this.logger('saveApiToken[%s]: %s',service,token)

    if (token) {
      gmStorageService.set(service, token);
    } else {
      gmStorageService.remove(service);
    }
  }

  public static getApiToken(service: StorageKey): string {
    const result = gmStorageService.get(service, "");
    // this.logger('getApiToken[%s]: %s',service,result)
    return result;
  }
}

class DomManipulator {
  private static logger = log.extend("DomManipulator");

  public static togglePopup(popup: HTMLElement, active: boolean): void {
    if (active) {
      popup.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      popup.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  public static toggleTokenContainer(
    mode: TranslationModeValue,
    elements: ElementCollection,
  ): void {
    // Hide all containers first
    elements.geminiTokenContainer.classList.remove("active");

    // Show the selected one
    if (mode === "gemini") {
      elements.geminiTokenContainer.classList.add("active");
    }
  }

  public static updateRadioSelection(
    options: NodeListOf<HTMLElement>,
    selectedValue: string,
  ): void {
    options.forEach((option) => {
      const dataValue = option.getAttribute("data-value");
      if (dataValue === selectedValue) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });
  }

  public static showConfirmation(message: string): void {
    alert(message);
  }

  public static logAction(action: string, data: any): void {
    this.logger("[%s]%o", action, data);
  }
}

class TranslationSettings {
  private elements: ElementCollection;
  private isPopupActive: boolean = false;

  constructor() {
    this.elements = this.initElements();
    this.initEventListeners();
  }

  private initElements(): ElementCollection {
    return {
      closePopupBtn: document.getElementById("closePopup") as HTMLElement,
      popup: document.getElementById("popup") as HTMLElement,
      saveSettingsBtn: document.getElementById("saveSettings") as HTMLElement,
      targetLanguageSelect: document.getElementById(
        "targetLanguage",
      ) as HTMLSelectElement,
      radioOptions: document.querySelectorAll(
        ".radio-option",
      ) as NodeListOf<HTMLElement>,
      geminiTokenContainer: document.getElementById(
        "geminiTokenContainer",
      ) as HTMLElement,
      geminiTokenInput: document.getElementById(
        "geminiToken",
      ) as HTMLInputElement,
      saveGeminiTokenBtn: document.getElementById(
        "saveGeminiToken",
      ) as HTMLElement,
    };
  }

  private initEventListeners(): void {
    // Popup controls
    this.elements.closePopupBtn.addEventListener("click", () =>
      this.togglePopup(),
    );

    this.elements.saveSettingsBtn.addEventListener("click", () =>
      this.saveSettings(),
    );

    // Language selection change
    this.elements.targetLanguageSelect.addEventListener("change", () => {
      DomManipulator.logAction(
        "Language Selection",
        `Changed to: ${this.elements.targetLanguageSelect.value}`,
      );
    });

    // Close popup when clicking outside
    this.elements.popup.addEventListener("click", (e) => {
      if (e.target === this.elements.popup) {
        this.togglePopup();
      }
    });

    // Radio option selection
    this.elements.radioOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const radioInput = option.querySelector(
          'input[type="radio"]',
        ) as HTMLInputElement;
        const mode = radioInput.value as TranslationModeValue;

        radioInput.checked = true;
        this.elements.radioOptions.forEach((opt) =>
          opt.classList.remove("selected"),
        );
        option.classList.add("selected");

        DomManipulator.toggleTokenContainer(mode, this.elements);
        DomManipulator.logAction("Translation Mode", `Changed to: ${mode}`);
      });
    });

    // Save token buttons
    this.elements.saveGeminiTokenBtn.addEventListener("click", () =>
      this.saveApiToken(StorageKey.geminiToken),
    );
  }

  private loadSettings(): void {
    const savedLanguage = SettingsStorage.getLanguage();
    const savedMode: TranslationModeValue = SettingsStorage.getMode();

    this.elements.targetLanguageSelect.value = savedLanguage;
    const modeRadio = document.querySelector(
      `input[value="${savedMode}"]`,
    ) as HTMLInputElement;
    if (modeRadio) {
      modeRadio.checked = true;
    }

    // Load API tokens
    this.elements.geminiTokenInput.value = SettingsStorage.getApiToken(
      StorageKey.geminiToken,
    );

    // Update UI to reflect settings
    DomManipulator.updateRadioSelection(this.elements.radioOptions, savedMode);
    DomManipulator.toggleTokenContainer(savedMode, this.elements);

    DomManipulator.logAction("Settings Loaded", {
      language: savedLanguage,
      mode: savedMode,
      tokens: {
        gemini: this.elements.geminiTokenInput.value ? "*****" : "not set",
      },
    });
  }

  public togglePopup(): void {
    this.isPopupActive = !this.isPopupActive;
    DomManipulator.togglePopup(this.elements.popup, this.isPopupActive);

    if (this.isPopupActive) {
      this.loadSettings();
    }
  }

  private saveSettings(): void {
    const config = this.getCurrentConfig();

    SettingsStorage.saveLanguage(config.language);
    SettingsStorage.saveMode(config.mode);

    DomManipulator.logAction("Settings Saved", {
      language: config.language,
      mode: config.mode,
      tokens: {
        gemini: this.elements.geminiTokenInput.value ? "*****" : "not set",
      },
    });

    // Show confirmation
    const selectedLanguageText =
      this.elements.targetLanguageSelect.options[
        this.elements.targetLanguageSelect.selectedIndex
      ].text;
    DomManipulator.showConfirmation(
      `Settings saved!\nLanguage: ${selectedLanguageText}\nMode: ${config.mode}`,
    );

    this.togglePopup();
  }

  private saveApiToken(service: keyof IStorage): void {
    const tokenInput =
      service === StorageKey.geminiToken
        ? this.elements.geminiTokenInput
        : null;
    if (!tokenInput) return;

    const token = tokenInput.value.trim();
    SettingsStorage.saveApiToken(service, token);

    DomManipulator.logAction(
      "API Token",
      `${service} token ${token ? "saved" : "cleared"}`,
    );
    DomManipulator.showConfirmation(
      `${service} API token ${token ? "saved" : "cleared"} successfully!`,
    );
  }

  private getCurrentConfig(): TranslationConfig {
    const checkedRadio = document.querySelector(
      'input[name="translationMode"]:checked',
    ) as HTMLInputElement;
    return {
      language: this.elements.targetLanguageSelect.value,
      mode: checkedRadio
        ? (checkedRadio.value as TranslationModeValue)
        : TranslationModeValue.google,
    };
  }
}

//   document.addEventListener("DOMContentLoaded", () => {});

export { TranslationSettings };
