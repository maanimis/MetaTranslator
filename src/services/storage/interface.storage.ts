import { Config } from "../../config";
import { StorageKey } from "./enum.storage";

export interface IStorage {
  [StorageKey.targetLang]: string;
  [StorageKey.geminiToken]: string;
  [StorageKey.translationMode]: string;
  [Config.defaultTargetLang]: string;
}

export interface IStorageEvent {
  onChange<T extends keyof IStorage>(
    key: T,
    callback: (newValue: IStorage[T], oldValue: IStorage[T]) => void,
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
