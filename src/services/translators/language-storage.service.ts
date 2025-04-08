import { storageHandlerSingleton, StorageKey } from "../storage";
import { ILanguageStorage } from "./interface.translators";

export class LocalStorageLanguageService implements ILanguageStorage {
  getTargetLanguage(): string {
    return storageHandlerSingleton.get(
      StorageKey.targetLang,
      StorageKey.defaultTargetLang,
    );
  }

  setTargetLanguage(lang: string): void {
    storageHandlerSingleton.set(StorageKey.targetLang, lang);
  }
}
