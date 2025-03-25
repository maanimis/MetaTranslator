import { StorageKey } from "./enum.storage";

export interface IStorage {
  [StorageKey.isEnable]: boolean;
  [StorageKey.toLang]: string;
  [StorageKey.lastUsed]: number;
}

export interface IStorageEvent {
  onChange<T>(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<T>,
  ): void;
}

export interface IStorageService {
  get<T = null>(key: StorageKey, defaultValue: T): T;
  set<T>(key: StorageKey, value: T): void;
  remove(key: StorageKey): void;
}
