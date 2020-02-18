import { decorator, ServiceIdentifier } from '../instantiation/instantiation';
import { IInstantiationService } from '../instantiation/instantiationService';
import { CommandsRegistry } from './commands';

export const ICommandService: ServiceIdentifier<CommandService> = decorator<
    CommandService
>('commandService');

export class CommandService {
    constructor(
        @IInstantiationService
        private instantiationService: IInstantiationService
    ) {}

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
