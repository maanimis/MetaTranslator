import {
  TranslationModeKey,
  storageHandlerSingleton,
  StorageKey,
} from "../../services/storage";
import { LanguageService } from "../../services/translators/language-storage.service";
import {
  ElementCollection,
  TranslationConfig,
  TranslationModeValue,
} from "../interfaces.popup";

// Single Responsibility - Settings Storage
class SettingsStorage {
  public static saveLanguage(language: string): void {
    LanguageService.setTargetLanguage(language);
  }

  public static getLanguage(): string {
    return LanguageService.getTargetLanguage();
  }

  public static saveMode(mode: TranslationModeValue): void {
    storageHandlerSingleton.set(StorageKey.translationMode, mode);
  }

  public static getMode(): string {
    return storageHandlerSingleton.get(
      StorageKey.translationMode,
      TranslationModeValue.google,
    );
  }

  public static saveApiToken(service: TranslationModeKey, token: string): void {
    if (token) {
      storageHandlerSingleton.set(service, token);
    } else {
      storageHandlerSingleton.remove(service);
    }
  }

  public static getApiToken(service: TranslationModeKey): string {
    return storageHandlerSingleton.get(service, "");
  }
}

// Single Responsibility - DOM Interaction
class DomManipulator {
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
    mode: string,
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
    console.log(`[${action}]`, data);
  }
}

// Main class following Open/Closed principle (extendable design)
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
        const mode = radioInput.value;

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
    const savedMode = SettingsStorage.getMode();

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

  private saveApiToken(service: TranslationModeKey): void {
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
