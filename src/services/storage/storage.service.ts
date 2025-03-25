import { StorageKey } from "./enum.storage";
import { IStorageEvent, IStorageService } from "./interface.storage";

class GM_StorageService implements IStorageService, IStorageEvent {
  get<T = null>(key: StorageKey, defaultValue: T): T {
    return GM_getValue(key, defaultValue);
  }

  set<T>(key: StorageKey, value: T): void {
    GM_setValue(key, value);
  }

  remove(key: StorageKey): void {
    GM_deleteValue(key);
  }

  onChange<T>(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<T>,
  ): void {
    GM_addValueChangeListener(key, callback);
  }
}

export const GMStorageService = new GM_StorageService();
