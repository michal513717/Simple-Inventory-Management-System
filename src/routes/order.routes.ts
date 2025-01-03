import express, { Application } from "express";
import { CommonRoutes } from "../common/commonRoutes";


export class OrderRoutes extends CommonRoutes {

    constructor(app: Application) {
        super(app, "OrderRoutes", "0.0.1");
    }

    configureRoutes() {

        const orderRouter = express.Router();

        orderRouter.post('/orders', (req, res) => {})

        this.app.use('/api', orderRouter);

        return this.app;
    }
}