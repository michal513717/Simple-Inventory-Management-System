import { Order } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { OrderRepository } from '../repositories/order.repository';
import mongoose from 'mongoose';
import { CreateOrderCommand } from './create-order.command';
import { InsufficientStockError, ProductNotFoundError } from '../utils/errorsWithCode';
import { EventStore } from '../databases/eventStore';
import { EventsCreator } from '../utils/events';
import { OrderCreatedEvent } from '../models/common.models';

export class CreateOrderCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private orderRepository: OrderRepository,
        private eventStore: EventStore
    ) { }

    async handle(command: CreateOrderCommand): Promise<void> {
        const session = await mongoose.startSession();
        const event = new EventsCreator<OrderCreatedEvent>("OrderCreated", command).create();
        session.startTransaction();
        try {
            for (const productInfo of command.products) {
                const product = await this.productRepository.findById(productInfo.productId);
                
                if (!product) {
                    throw new ProductNotFoundError();
                }

                if (product.stock < productInfo.quantity) {
                    throw new InsufficientStockError();
                }

                product.stock -= productInfo.quantity;
                await this.productRepository.update(product, session);
            }

            //TODO FIX TYPES
            const orderData: Order = {
                customerId: command.customerId,
                //@ts-ignore
                products: command.products,
                createdAt: new Date()
            }

            await this.orderRepository.create(orderData, session);

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            event.status = "FAILED";
            throw error;
        } finally {
            session.endSession();
            this.eventStore.append(event);
        }
    }
}