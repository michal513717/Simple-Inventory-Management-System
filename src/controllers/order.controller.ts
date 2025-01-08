import { Request, Response } from 'express';
import { CreateOrderCommand } from '../commands/create-order.command';
import { commandDispatchManager } from '../managers/commandDispatchManager';
import { internalServerErrorResponse, validationErrorResponse } from '../utils/responses';
import { createOrderValidator } from '../utils/validators';
import { validationResult } from 'express-validator';
import { ErrorWithCode, ValidationError } from '../utils/errorsWithCode';

export class OrderController {
    constructor() { }

    async createOrder(req: Request, res: Response) {
        try {
            await Promise.all(createOrderValidator.map(validation => validation.run(req)));

            if (validationResult(req).isEmpty() === false) {
                throw new ValidationError();
            }

            await commandDispatchManager.dispatch(new CreateOrderCommand(req.body.customerId, req.body.products));

            res.status(201).send({ result: { message: 'Order created successfully' }});
        } catch (error) {

            if (validationResult(req).isEmpty() === false) {
                return validationErrorResponse(res, validationResult(req).array());
            }

            if(error instanceof ErrorWithCode){
                return res.status(error.status).json(error.toJSON());
            }

            return internalServerErrorResponse(res);
        }
    }
}