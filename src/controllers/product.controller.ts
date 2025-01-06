import { Request, Response } from 'express';
import { CreateProductCommand } from '../commands/create-product.command';
import { GetProductsQuery } from '../queries/get-product.query';
import { RestockProductCommand } from '../commands/restock-product.command';
import { SellProductCommand } from '../commands/sell-product.command';

export class ProductController {
    constructor(
        private createProductCommand: CreateProductCommand,
        private getProductsQuery: GetProductsQuery,
        private restockProductCommand: RestockProductCommand,
        private sellProductCommand: SellProductCommand
    ) { }

    async createProduct(req: Request, res: Response) {
        try {//TODO
            const product = await this.createProductCommand.execute(req.body);
            res.status(201).json(product);
        } catch (error: any) {

            //TODO
            res.status(500).json({ error: error.message });
        }
    }

    async restockProduct(req: Request, res: Response) {
        try {
            const { quantity } = req.body;
            const { id } = req.params;

            await this.restockProductCommand.execute(id, quantity);
            res.status(200).send();//TODO
        } catch (error: any) {
            //TODO
            res.status(500).json({ error: error.message });
        }
    }

    async sellProduct(req: Request, res: Response) {
        try {
            const { quantity } = req.body;
            const { id } = req.params;

            await this.sellProductCommand.execute(id, parseInt(quantity));
        } catch (error: any) {
            //TODO
            res.status(500).json({ error: error.message });
        }
    }

    async getProducts(req: Request, res: Response) {
        const products = await this.getProductsQuery.execute();
        res.json(products);
    }
}