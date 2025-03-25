import { SessionStorageService } from "./cache.storage";
import { StorageKey } from "./enum.storage";
import { IStorage, IStorageService } from "./interface.storage";
import { GMStorageService } from "./storage.service";

class StorageHandler implements IStorageService {
  constructor(
    private sessionStorageService: SessionStorageService,
    private gmStorageService: GMStorageService,
  ) {}

  get<T extends keyof IStorage>(
    key: StorageKey,
    defaultValue: IStorage[T],
  ): IStorage[T] {
    const sessionValue = this.sessionStorageService.get(key, defaultValue);
    if (sessionValue !== undefined && sessionValue !== null) {
      return sessionValue;
    }

    return this.gmStorageService.get(key, defaultValue);
  }

  set<T extends keyof IStorage>(key: T, value: IStorage[T]): void {
    this.sessionStorageService.set(key, value);
    this.gmStorageService.set(key, value);
  }

  remove(key: keyof IStorage): void {
    this.sessionStorageService.remove(key);
    this.gmStorageService.remove(key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: (newValue: IStorage[T], oldValue: IStorage[T]) => void,
  ): void {
    this.sessionStorageService.onChange(key, callback);
    this.gmStorageService.onChange(key, callback);
  }
}

const sessionStorageService = new SessionStorageService();
const gmStorageService = new GMStorageService();

export const storageHandler = new StorageHandler(
  sessionStorageService,
  gmStorageService,
);
