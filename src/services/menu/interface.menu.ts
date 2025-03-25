export interface MenuCommand {
  id: string;
  name: string;
  callback: () => void;
}

export interface IMenuCommandRepository {
  add(command: MenuCommand): void;
  remove(name: string): MenuCommand | undefined;
  get(name: string): MenuCommand | undefined;
  getAll(): MenuCommand[];
  clear(): void;
}
