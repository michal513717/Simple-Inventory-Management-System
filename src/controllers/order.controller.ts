import { Request, Response } from 'express';
import { CreateOrderCommand } from '../commands/create-order.command';
import { commandDispatchManager } from '../managers/commandDispatchManager';

export class OrderController {
    constructor() { }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            //TODO validate and add custom errors
            const command: CreateOrderCommand = {
                customerId: req.body.customerId,
                products: req.body.products,
            };
            await commandDispatchManager.dispatch(new CreateOrderCommand(req.body.customerId, req.body.products));

            res.status(201).send({ message: 'Order created successfully' })
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Failed to create order' });
        }
    }
}



