import { Order } from '../models/mongoSchemas';
import { ProductUpdateRepository } from '../repositories/product-update.repository';
import { OrderRepository } from '../repositories/order.repository';
import mongoose from 'mongoose';
import { CreateOrderCommand } from './create-order.command';
import { InsufficientStockError, ProductNotFoundError } from '../utils/errorsWithCode';
import { EventStore } from '../databases/eventStore';
import { EventsCreator } from '../utils/events';
import { OrderCreatedEvent } from '../models/common.models';
import { ProductReadRepository } from '../repositories/product-read.repository';
import { ProductReadMongoRepository } from '../repositories/product-read.mongo.repository';

/**
 * @fileOverview CreateOrderCommandHandler - manages order creation, product stock levels and event logging.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductRepository} productRepository - repository for managing products
 * @param {OrderRepository} orderRepository - repository for managing orders
 * @param {EventStore} eventStore - event store for logging events
 * @param {ProductReadRepository | ProductReadMongoRepository} productReadRepository - read repository for managing product stock levels
 */

export class CreateOrderCommandHandler {
    constructor(
        private productUpdateRepository: ProductUpdateRepository,
        private orderRepository: OrderRepository,
        private eventStore: EventStore,
        private productReadRepository: ProductReadRepository | ProductReadMongoRepository 
    ) { }

    async handle(command: CreateOrderCommand): Promise<void> {
        const session = await mongoose.startSession();
        const event = new EventsCreator<OrderCreatedEvent>("OrderCreated", command).create();
        session.startTransaction();
        try {
            const productsToDecrease = [];
            for (const productInfo of command.products) {
                const product = await this.productUpdateRepository.findById(productInfo.productId);
                
                if (!product) {
                    throw new ProductNotFoundError();
                }

                if (product.stock < productInfo.quantity) {
                    throw new InsufficientStockError();
                }

                product.stock -= productInfo.quantity;

                productsToDecrease.push({ id: product._id.toString(), quantity: product.stock });

                await this.productUpdateRepository.update(product, session);
            }

            //TODO FIX TYPES
            const orderData: Order = {
                customerId: command.customerId,
                //@ts-ignore
                products: command.products,
                createdAt: new Date()
            }

            await this.orderRepository.create(orderData, session);

            // It was a elastic search, so we need to update the stock in the read repository as well
            // for(const productInfo of productsToDecrease){
                // this.productReadRepository.updateStock(productInfo.id, productInfo.quantity);
            // }

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