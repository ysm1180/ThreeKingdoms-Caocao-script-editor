import { decorator } from '../instantiation/instantiation';
import { IInstantiationService, InstantiationService } from '../instantiation/instantiationService';
import { CommandsRegistry } from './commands';

export const ICommandService = decorator<CommandService>('commandService');



export class CommandService {
    constructor(
        @IInstantiationService private instantiationService: InstantiationService
    ) {
    }  

    public run<T>(id: string, ...args: any[]): T {
        const command = CommandsRegistry.getCommand(id);
        if (!command) {
            return null;
        }
        return this.instantiationService.invokeFunction.apply(this.instantiationService, [command.handler].concat(args));
    }
}