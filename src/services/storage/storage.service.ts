import { IStorage, IStorageEvent, IStorageService } from "./interface.storage";

class GMStorageService implements IStorageService, IStorageEvent {
  get<T>(key: string, defaultValue: T): T {
    return GM_getValue(key, defaultValue);
  }

  set<T>(key: string, value: T): void {
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

const gmStorageSingleton = new GMStorageService();

export { gmStorageSingleton, GMStorageService };
