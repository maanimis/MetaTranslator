import { IMenuCommandRepository, MenuCommand } from "./interface.menu";

class MenuCommandRepository implements IMenuCommandRepository {
  private commands = new Map<string, MenuCommand>();

  add(command: MenuCommand): void {
    this.commands.set(command.name, command);
  }

  remove(name: string): MenuCommand | undefined {
    const command = this.commands.get(name);
    if (command) {
      this.commands.delete(name);
    }
    return command;
  }

  get(name: string): MenuCommand | undefined {
    return this.commands.get(name);
  }

  getAll(): MenuCommand[] {
    return Array.from(this.commands.values());
  }

  clear(): void {
    this.commands.clear();
  }

  has(name: string): boolean {
    return Boolean(this.commands.get(name));
  }
}

class MenuCommandService {
  constructor(private _repository: IMenuCommandRepository) {}

  register(name: string, callback: () => void): MenuCommand {
    this.unregister(name);

    const id = GM_registerMenuCommand(name, callback);
    const command: MenuCommand = { id, name, callback };

    this._repository.add(command);

    return command;
  }

  unregister(name: string): void {
    const command = this._repository.remove(name);

    if (command) {
      GM_unregisterMenuCommand(command.id);
    }
  }

  unregisterAll(): void {
    this._repository.getAll().forEach((command) => {
      GM_unregisterMenuCommand(command.id);
    });

    this._repository.clear();
  }
}

const createMenuCommandManager = (): MenuCommandService => {
  const repository = new MenuCommandRepository();
  return new MenuCommandService(repository);
};

export const menuCommandManager = createMenuCommandManager();

export const registerMenuCommand = (
  name: string,
  callback: () => void,
): string => menuCommandManager.register(name, callback).id;

export const unregisterMenuCommand = (name: string): void =>
  menuCommandManager.unregister(name);
