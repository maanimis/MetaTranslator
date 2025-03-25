import { StorageKey } from "./enum.storage";
import { IStorage, IStorageEvent, IStorageService } from "./interface.storage";

export class SessionStorageService implements IStorageService, IStorageEvent {
  get<T extends keyof IStorage>(
    key: StorageKey,
    defaultValue: IStorage[T],
  ): IStorage[T] {
    const item = sessionStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  }

  set<T extends keyof IStorage>(key: T, value: IStorage[T]): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: keyof IStorage): void {
    sessionStorage.removeItem(key);
  }

  onChange<T extends keyof IStorage>(
    key: T,
    callback: (newValue: IStorage[T], oldValue: IStorage[T]) => void,
  ): void {
    const storageHandler = (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
        callback(newValue, oldValue);
      }
    };
    window.addEventListener("storage", storageHandler);
  }
}
