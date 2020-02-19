import { IDisposable } from '../../base/common/lifecycle';
import { ServicesAccessor } from '../instantiation/instantiation';

export interface ICommandHandler {
  (accecsor: ServicesAccessor, ...args: any[]): any;
}

export interface ICommand {
  id: string;
  handler: ICommandHandler;
}

export const CommandsRegistry = new (class {
  _commands = new Map<string, ICommand>();

  constructor() {}

  public register(command: ICommand): IDisposable {
    const { id } = command;
    const commands = this._commands.get(id);
    if (!commands) {
      this._commands.set(id, command);
    }

    return {
      dispose: () => {
        this._commands.delete(id);
      },
    };
  }

  public getCommand(id: string): ICommand {
    if (this._commands.has(id)) {
      return this._commands.get(id);
    }

    return undefined;
  }

  public getCommands(): Map<string, ICommand> {
    return this._commands;
  }
})();
