import { decorator, ServicesAccessor } from 'code/platform/instantiation/instantiation';
import { IInstantiationService, InstantiationService } from '../instantiation/instantiationService';

export const ICommandService = decorator<CommandService>('commandService');

export class CommandService {
    constructor(
        @IInstantiationService private instantiationService: InstantiationService
    ) {
    }  

    public run<T>(fn: (accecsor: ServicesAccessor) => T, ...args: any[]): T {
        return this.instantiationService.invokeFunction(fn, ...args);
    }
}