import { StorageKey } from "./enum.storage";
import { IStorage, IStorageEvent, IStorageService } from "./interface.storage";

export class GMStorageService implements IStorageService, IStorageEvent {
  get<T extends keyof IStorage>(
    key: StorageKey,
    defaultValue: IStorage[T],
  ): IStorage[T] {
    return GM_getValue(key, defaultValue);
  }

  set<T extends keyof IStorage>(key: T, value: IStorage[T]): void {
    GM_setValue(key, value);
  }

  remove(key: keyof IStorage): void {
    GM_deleteValue(key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: VMScriptGMValueChangeCallback<IStorage[T]>,
  ): void {
    GM_addValueChangeListener(key, callback);
  }
}
