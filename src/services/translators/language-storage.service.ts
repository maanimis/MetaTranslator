import { Config } from "../../config";
import { storageHandlerSingleton, StorageKey } from "../storage";

export class LanguageService {
  private constructor() {}

  static getSourceLanguage(): string {
    return "auto";
  }

  static getTargetLanguage(): string {
    return storageHandlerSingleton.get(
      StorageKey.targetLang,
      Config.defaultTargetLang,
    );
  }

  static setTargetLanguage(lang: string): void {
    storageHandlerSingleton.set(StorageKey.targetLang, lang);
  }
}
