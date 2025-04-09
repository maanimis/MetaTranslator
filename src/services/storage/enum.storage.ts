export const enum StorageKey {
  lastUsed = "lastUsed",
  targetLang = "targetLang",
  translationMode = "translationMode",
  geminiToken = "geminiApiToken",
}

export type TranslationModeKey = StorageKey.geminiToken;
