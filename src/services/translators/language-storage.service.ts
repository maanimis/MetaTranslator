import { Config } from "../../config";
import { StorageKey } from "../storage";
import { gmStorageService } from "../storage/storage.service";
import debug from "debug";

const log = debug("app:language");

export class LanguageService {
  private constructor() {}

  static getSourceLanguage(): string {
    const result = "auto";
    log(result);
    return result;
  }

  static getTargetLanguage(): string {
    const result = gmStorageService.get(
      StorageKey.targetLang,
      Config.defaultTargetLang,
    );
    log("getTargetLanguage: %s", result);
    return result;
  }

  static setTargetLanguage(lang: string): void {
    gmStorageService.set(StorageKey.targetLang, lang);
  }
}
