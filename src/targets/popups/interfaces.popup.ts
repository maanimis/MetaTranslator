export interface ElementCollection {
  closePopupBtn: HTMLElement;
  popup: HTMLElement;
  saveSettingsBtn: HTMLElement;
  targetLanguageSelect: HTMLSelectElement;
  radioOptions: NodeListOf<HTMLElement>;
  geminiTokenContainer: HTMLElement;
  geminiTokenInput: HTMLInputElement;
  saveGeminiTokenBtn: HTMLElement;
}

export const enum TranslationModeValue {
  google = "google",
  geminiApi = "gemini",
}

export interface TranslationConfig {
  language: string;
  mode: TranslationModeValue;
}
