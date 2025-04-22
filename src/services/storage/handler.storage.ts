// import { IStorage, IStorageService } from "./interface.storage";

// class StorageHandler implements IStorageService {
//   constructor() {}

//   get<T>(key: string, defaultValue: T): T {
//     const sessionValue = sessionStorageSingleton.get(key, defaultValue);
//     if (sessionValue !== undefined && sessionValue !== null) {
//       return sessionValue;
//     }

//     return gmStorageSingleton.get(key, defaultValue);
//   }

//   set<T>(key: string, value: T): void {
//     sessionStorageSingleton.set(key, value);
//     gmStorageSingleton.set(key, value);
//   }

//   remove(key: keyof IStorage): void {
//     sessionStorageSingleton.remove(key);
//     gmStorageSingleton.remove(key);
//   }

//   onChange<T extends keyof IStorage>(
//     key: T,
//     callback: VMScriptGMValueChangeCallback<IStorage[T]>
//   ): void {
//     sessionStorageSingleton.onChange(key, callback);
//     gmStorageSingleton.onChange(key, callback);
//   }
// }

// const storageHandlerSingleton = new StorageHandler();

// export { storageHandlerSingleton };
