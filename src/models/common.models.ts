import * as http from "http";

export type HttpServer = http.Server;
export type NextFunction = (args: CommonNextFunctionArgs) => void;
export type CommonNextFunctionArgs = unknown;
export type BasicAuth = {
    id: string;
    api_key: string;
};

export interface Command {};
export interface CommandHandler<T extends Command>{
    handle(command: T): Promise<void>;
};