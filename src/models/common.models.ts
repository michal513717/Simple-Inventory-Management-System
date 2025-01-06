import * as http from "http";

export type HttpServer = http.Server;
export type NextFunction = () => void;
export type BasicAuth = {
    id: string;
    api_key: string;
}