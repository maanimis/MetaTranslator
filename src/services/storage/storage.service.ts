import { IStorage, IStorageEvent, IStorageService } from "./interface.storage";
import debug from "debug";

const log = debug("app:storage:gm");

class GMStorageService implements IStorageService, IStorageEvent {
  get<T>(key: string, defaultValue: T): T {
    const result = GM_getValue(key, defaultValue);
    log("[GET]key: %s | value: %o", key, result);
    return result;
  }

  set<T>(key: string, value: T): void {
    GM_setValue(key, value);
    log("[SET]key: %s | value: %o", key, value);
  }

  remove(key: keyof IStorage): void {
    GM_deleteValue(key);
    log("[DELETE]key: %s", key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: VMScriptGMValueChangeCallback<IStorage[T]>,
  ): void {
    GM_addValueChangeListener(key, callback);
    log("GM_addValueChangeListener: %s", key);
  }
}

const gmStorageService = new GMStorageService();

export { gmStorageService };
