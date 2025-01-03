import { APPLICATION_CONFIG } from "../applicationConfig";
import { NotValidRoutes } from "./routes/notValid.routes";
import { CommonRoutes } from "./common/commonRoutes";
import { HttpServer } from "./models/common.models";
import { Debugger } from "./utils/requestDebugger";
import express, { Application } from "express";

import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import * as http from "http";
import 'dotenv/config';

import { closeMongoConnection, connectMongoDB } from "./database/mongoClient";
import { connectElasticSearch } from "./database/elasticSearchClient";

export class MainApp {

    private config!: typeof APPLICATION_CONFIG;
    private application!: Application;
    private server!: HttpServer;
    private routes!: CommonRoutes[];

    static async createClassInstance() {
        const mainApp = new MainApp();
        await mainApp.init();
        return mainApp;
    }    

    private async init(): Promise<void> {

        await this.initDatabases();
        this.initApplicationConfig();
        this.initApplicationAndServer();
        this.initBasicDebug();
        this.initRoutes();
        this.startServer();
        this.setupCloseListeners();
    }

    private async initDatabases(): Promise<void> {
        await connectMongoDB();
        await connectElasticSearch();
    }

    private initApplicationConfig(): void {
        this.config = APPLICATION_CONFIG;
    }

    private initApplicationAndServer(): void {

        this.application = express();
        this.application.use(cors(this.config.CORS_CONFIG as CorsOptions));
        this.application.use(express.json());
        this.server = http.createServer(this.application);

        this.application.use(bodyParser.urlencoded({ extended: true }));
    }

    private initBasicDebug(): void {
        if (APPLICATION_CONFIG.DEBUG_REQUEST === true) {
            Debugger.debugRequest(this.application);
        }
    }

    private initRoutes(): void {

        const application = this.application;

        this.routes = [];

        this.routes.push(new NotValidRoutes(application));
    }

    private startServer(): void {

        const port = this.config.APPLICATION_PORT;

        const runningMessage = `Server running at http://localhost:${port}`;

        this.server.listen(port, () => {
            this.routes.forEach((route) => {
                console.info(
                    `Routes configured for ${route.getVersion()} - ${route.getName()}`
                );
            });

            console.info(runningMessage);
        });
    }

    private setupCloseListeners(): void {

        console.info('Setup listeners of executing closing process');

        for (const signal of APPLICATION_CONFIG.EXIT_SIGNALS) {
            process.on(signal as string, async () => {
                console.info(`Cached signal ${signal}`)
                await closeMongoConnection();
            })
        }

        this.server.on('close', async () => {
            console.info("Server close.")
        })
    }
}