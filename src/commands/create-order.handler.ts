import { Order } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { OrderRepository } from '../repositories/order.repository';
import mongoose from 'mongoose';
import { CreateOrderCommand } from './create-order.command';
import { InsufficientStockError, ProductNotFoundError } from '../utils/errorsWithCode';
import { EventStore } from '../databases/eventStore';
import { EventsCreator } from '../utils/events';
import { OrderCreatedEvent } from '../models/common.models';
import { ProductReadRepository } from '../repositories/product-read.repository';

export class CreateOrderCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private orderRepository: OrderRepository,
        private eventStore: EventStore,
        private productReadRepository: ProductReadRepository
    ) { }

    async handle(command: CreateOrderCommand): Promise<void> {
        const session = await mongoose.startSession();
        const event = new EventsCreator<OrderCreatedEvent>("OrderCreated", command).create();
        session.startTransaction();
        try {
            const productsToDecrease = [];
            for (const productInfo of command.products) {
                const product = await this.productRepository.findById(productInfo.productId);
                
                if (!product) {
                    throw new ProductNotFoundError();
                }

                if (product.stock < productInfo.quantity) {
                    throw new InsufficientStockError();
                }

                product.stock -= productInfo.quantity;

                productsToDecrease.push({ id: product._id.toString(), quantity: product.stock });

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

            for(const productInfo of productsToDecrease){
                this.productReadRepository.updateStock(productInfo.id, productInfo.quantity);
            }

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            event.status = "FAILED";
            event.error = error;
            throw error;
        } finally {
            session.endSession();
            this.eventStore.append(event);
        }
    }
}