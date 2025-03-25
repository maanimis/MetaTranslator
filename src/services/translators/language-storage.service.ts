import { storageHandler, StorageKey } from "../storage";
import { ILanguageStorage } from "./interface.translators";

export class LocalStorageLanguageService implements ILanguageStorage {
  getTargetLanguage(): string {
    return storageHandler.get(
      StorageKey.targetLang,
      StorageKey.defaultTargetLang,
    );
  }

  setTargetLanguage(lang: string): void {
    GM_setValue(StorageKey.targetLang, lang);
  }
}
