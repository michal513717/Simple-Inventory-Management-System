import express, { Application } from "express";
import { CommonRoutes } from "../common/commonRoutes";


export class StockRoutes extends CommonRoutes {

    constructor(app: Application) {
        super(app, "StockRoutes", "0.0.1");
    }

    configureRoutes() {

        const stockRouter = express.Router();

        stockRouter.post('/:id/restock', (req, res) => {});

        stockRouter.post('/:id/sell', (req, res) => {});

        this.app.use('/products', stockRouter);

        return this.app;
    }
}