import { Request, Response } from 'express';
import { CreateProductCommand } from '../commands/create-product.command';
import { GetProductsQuery } from '../queries/get-product.query';
import { RestockProductCommand } from '../commands/restock-product.command';
import { SellProductCommand } from '../commands/sell-product.command';
import { commandDispatchManager } from '../managers/commandDispatchManager';

export class ProductController {
    constructor(
        private createProductCommand: CreateProductCommand,
        private getProductsQuery: GetProductsQuery
    ) { }

    async createProduct(req: Request, res: Response) {
        try {
            //TODO validate and add custom errors
            const product = await this.createProductCommand.execute(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async restockProduct(req: Request, res: Response) {
        try {
            //TODO validate and add custom errors
            const { quantity } = req.body;
            const { id } = req.params;

            await commandDispatchManager.dispatch(new RestockProductCommand(id, quantity));
            res.status(200).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async sellProduct(req: Request, res: Response) {
        try {
            //TODO validate and add custom errors
            const { quantity } = req.body;
            const { id } = req.params;

            await commandDispatchManager.dispatch(new SellProductCommand(id, quantity));
            res.status(200).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProducts(req: Request, res: Response) {
        const products = await this.getProductsQuery.execute();
        res.json(products);
    }
}