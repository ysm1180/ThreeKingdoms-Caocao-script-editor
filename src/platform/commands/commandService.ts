import { IInstantiationService, decorator } from '../instantiation/instantiation';
import { CommandsRegistry } from './commands';

export const ICommandService = decorator<CommandService>('commandService');

export class CommandService {
  constructor(@IInstantiationService private instantiationService: IInstantiationService) {}

  public run<T>(id: string, ...args: any[]): T {
    const command = CommandsRegistry.getCommand(id);
    if (!command) {
      return null;
    }
    return this.instantiationService.invokeFunction.apply(
      this.instantiationService,
      [command.handler].concat(args) as any[]
    );
  }
}
