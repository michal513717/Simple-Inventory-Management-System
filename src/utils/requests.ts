import type { Request, Response, NextFunction } from "express";
import { Application } from "express";
import * as log4js from 'log4js';

const logger = log4js.getLogger("http");

/**
 * @fileOverview Middleware and Route Configuration - Contains middleware for logging requests and handling invalid routes.
 * 
 * @author Michał Kuś
 * @module MiddlewareAndRouteConfig
 * @exports debugRequest - Middleware for logging HTTP requests
 * @exports configureNotValidRoute - Endpoint for handling invalid routes and errors
 */

export const debugRequest = async (application: Application) => {

    application.use((req, res, next) => {
        logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });

        next();
    });
}

export const configureNotValidRoute = (app: Application) => {
    app.all("*", async (req: Request, _res: Response, next: NextFunction) => {
        const err = new Error(`Route ${req.originalUrl} not found`) as Error & {
            statusCode: number;
        };
        err.statusCode = 404;
        next(err);
    });

    app.use(
        (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
            const isNonNullObject = typeof err === "object" && err !== null;

            const status =
                isNonNullObject && "status" in err ? err.status : "error";
            const statusCode =
                isNonNullObject && "statusCode" in err
                    ? isNaN(Number(err.statusCode))
                        ? 500
                        : (err.statusCode as number)
                    : 500;

            const message = isNonNullObject && "message" in err ? err.message : "";

            res.status(statusCode).json({
                status,
                message,
            });
        }
    );
}