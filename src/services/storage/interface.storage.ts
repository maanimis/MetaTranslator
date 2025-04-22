import { Config } from "../../config";
import { TranslationConfig } from "../../targets/popups/interfaces.popup";
import { StorageKey } from "./enum.storage";

export interface IStorage {
  [StorageKey.targetLang]: string;
  [StorageKey.geminiToken]: string;
  [StorageKey.translationMode]: TranslationConfig;
  [StorageKey.debugMode]: boolean;
  [Config.defaultTargetLang]: string;
}

export interface IStorageEvent {
  onChange<T extends keyof IStorage>(
    key: T,
    callback: VMScriptGMValueChangeCallback<IStorage[T]>,
  ): void;
}

export interface IStorageService {
  get<T>(key: string, defaultValue: T): T;
  set<T>(key: string, value: T): void;
  remove(key: keyof IStorage): void;
}

export interface ICache {
  [key: string]: string;
}
