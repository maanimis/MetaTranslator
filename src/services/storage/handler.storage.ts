import {
  SessionStorageService,
  sessionStorageSingleton,
} from "./cache.storage";
import { IStorage, IStorageService } from "./interface.storage";
import { GMStorageService, gmStorageSingleton } from "./storage.service";

class StorageHandler implements IStorageService {
  constructor(
    private sessionStorageSingleton: SessionStorageService,
    private gmStorageSingleton: GMStorageService,
  ) {}

  get<T>(key: string, defaultValue: T): T {
    const sessionValue = this.sessionStorageSingleton.get(key, defaultValue);
    if (sessionValue !== undefined && sessionValue !== null) {
      return sessionValue;
    }

    return this.gmStorageSingleton.get(key, defaultValue);
  }

  set<T>(key: string, value: T): void {
    this.sessionStorageSingleton.set(key, value);
    this.gmStorageSingleton.set(key, value);
  }

  remove(key: keyof IStorage): void {
    this.sessionStorageSingleton.remove(key);
    this.gmStorageSingleton.remove(key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: (newValue: IStorage[T], oldValue: IStorage[T]) => void,
  ): void {
    this.sessionStorageSingleton.onChange(key, callback);
    this.gmStorageSingleton.onChange(key, callback);
  }
}

const storageHandlerSingleton = new StorageHandler(
  sessionStorageSingleton,
  gmStorageSingleton,
);

export { storageHandlerSingleton };
