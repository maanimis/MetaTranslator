import { sessionStorageSingleton } from "./cache.storage";
import { IStorage, IStorageService } from "./interface.storage";
import { gmStorageSingleton } from "./storage.service";

class StorageHandler implements IStorageService {
  constructor() {}

  get<T>(key: string, defaultValue: T): T {
    const sessionValue = sessionStorageSingleton.get(key, defaultValue);
    if (sessionValue !== undefined && sessionValue !== null) {
      return sessionValue;
    }

    return gmStorageSingleton.get(key, defaultValue);
  }

  set<T>(key: string, value: T): void {
    sessionStorageSingleton.set(key, value);
    gmStorageSingleton.set(key, value);
  }

  remove(key: keyof IStorage): void {
    sessionStorageSingleton.remove(key);
    gmStorageSingleton.remove(key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: (newValue: IStorage[T], oldValue: IStorage[T]) => void,
  ): void {
    sessionStorageSingleton.onChange(key, callback);
    gmStorageSingleton.onChange(key, callback);
  }
}

const storageHandlerSingleton = new StorageHandler();

export { storageHandlerSingleton };
