import { Command, CommandHandler } from "../models/common.models";

/**
 * @fileOverview CommandDispatchManager - Manages registration and dispatching of command handlers.
 * 
 * @author Michał Kuś
 * @class
 */

class CommandDispatchManager {

    static #instance: CommandDispatchManager;

    private handlers = new Map<string, CommandHandler<Command>>();

    private constructor() { };

    public static get instance(): CommandDispatchManager {
        if(!CommandDispatchManager.#instance) {
            CommandDispatchManager.#instance = new CommandDispatchManager();
        }
        
        return CommandDispatchManager.#instance;
    };

    registerHandler<T extends Command>(commandName: string, handler: CommandHandler<T>) {
        this.handlers.set(commandName, handler);
    };

    async dispatch<T extends Command>(command: T): Promise<void> {
        const handler = this.handlers.get(command.constructor.name);
        if (!handler) {
            throw new Error(`No handler registered for command ${command.constructor.name}`);
        }
        await handler.handle(command);
    };
};

export const commandDispatchManager = CommandDispatchManager.instance;