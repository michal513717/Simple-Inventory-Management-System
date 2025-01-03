import express, { Application } from "express";
import { CommonRoutes } from "../common/commonRoutes";


export class ProductRoutes extends CommonRoutes {

    constructor(app: Application) {
        super(app, "ProductRoutes", "0.0.1");
    }

    configureRoutes() {

        const productRouter = express.Router();

        productRouter.post('/products', (req, res) => {});

        productRouter.get('/products', (req, res) => {});

        this.app.use('/api', productRouter);

        return this.app;
    }
}