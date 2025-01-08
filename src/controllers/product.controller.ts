import { Request, Response } from 'express';
import { CreateProductCommand } from '../commands/create-product.command';
import { GetProductsQuery } from '../queries/get-product.query';
import { RestockProductCommand } from '../commands/restock-product.command';
import { SellProductCommand } from '../commands/sell-product.command';
import { commandDispatchManager } from '../managers/commandDispatchManager';
import { internalServerErrorResponse, validationErrorResponse } from '../utils/responses';
import { validationResult } from 'express-validator';
import { newProductValidator, restockProductValidator, sellProductValidator } from '../utils/validators';
import { ErrorWithCode, ValidationError } from '../utils/errorsWithCode';

export class ProductController {
    constructor(
        private createProductCommand: CreateProductCommand,
        private getProductsQuery: GetProductsQuery
    ) { }

    async createProduct(req: Request, res: Response) {
        try {
            await Promise.all(newProductValidator.map(validation => validation.run(req)));

            if (validationResult(req).isEmpty() === false) {
                throw new ValidationError();
            }

            const product = await this.createProductCommand.execute(req.body);
            res.status(201).json(product);
        } catch (error: any) {

            if (validationResult(req).isEmpty() === false) {
                return validationErrorResponse(res, validationResult(req).array());
            }

            if (error instanceof ErrorWithCode) {
                return res.status(error.status).json(error.toJSON());
            }

            internalServerErrorResponse(res);
        }
    }

    async restockProduct(req: Request, res: Response) {
        try {

            await Promise.all(restockProductValidator.map(validation => validation.run(req)));

            if (validationResult(req).isEmpty() === false) {
                throw new ValidationError();
            }

            const { quantity } = req.body;
            const { id } = req.params;

            await commandDispatchManager.dispatch(new RestockProductCommand(id, quantity));
            res.status(200).send();
        } catch (error: any) {

            if (validationResult(req).isEmpty() === false) {
                return validationErrorResponse(res, validationResult(req).array());
            }

            if (error instanceof ErrorWithCode) {
                return res.status(error.status).json(error.toJSON());
            }

            internalServerErrorResponse(res);
        }
    }

    async sellProduct(req: Request, res: Response) {
        try {
            await Promise.all(sellProductValidator.map(validation => validation.run(req)));

            if (validationResult(req).isEmpty() === false) {
                throw new ValidationError();
            }

            const { quantity } = req.body;
            const { id } = req.params;

            await commandDispatchManager.dispatch(new SellProductCommand(id, quantity));
            res.status(200).send();
        } catch (error: any) {

            if (validationResult(req).isEmpty() === false) {
                return validationErrorResponse(res, validationResult(req).array());
            }

            if (error instanceof ErrorWithCode) {
                return res.status(error.status).json(error.toJSON());
            }

            return internalServerErrorResponse(res);
        }
    }

    async getProducts(req: Request, res: Response) {
        const products = await this.getProductsQuery.execute();
        res.json(products);
    }
}