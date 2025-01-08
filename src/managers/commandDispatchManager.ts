import { Command, CommandHandler } from "../models/common.models";

class CommandDispatchManager {
    private handlers = new Map<string, CommandHandler<Command>>();

    registerHandler<T extends Command>(commandName: string, handler: CommandHandler<T>) {
        this.handlers.set(commandName, handler);
    }

    async dispatch<T extends Command>(command: T): Promise<void> {
        const handler = this.handlers.get(command.constructor.name);
        if (!handler) {
            throw new Error(`No handler registered for command ${command.constructor.name}`);
        }
        await handler.handle(command);
    }
}

export const commandDispatchManager = new CommandDispatchManager();