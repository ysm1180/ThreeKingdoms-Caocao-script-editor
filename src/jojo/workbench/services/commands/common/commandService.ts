import { CommandsRegistry, ICommandService } from 'jojo/platform/commands/common/commands';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';

export class CommandService implements ICommandService {
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
