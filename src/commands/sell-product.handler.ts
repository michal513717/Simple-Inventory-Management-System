import { EventStore } from '../databases/eventStore';
import { ProductSoldEvent } from '../models/common.models';
import { ProductReadMongoRepository } from '../repositories/product-read.mongo.repository';
import { ProductReadRepository } from '../repositories/product-read.repository';
import { ProductRepository } from '../repositories/product-update.repository';
import { InsufficientStockError, ProductNotFoundError } from '../utils/errorsWithCode';
import { EventsCreator } from '../utils/events';
import { SellProductCommand } from './sell-product.command';
import mongoose from 'mongoose';

/**
 * @fileOverview SellProductCommandHandler - Handles the selling of products, managing stock levels, and logging events.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductRepository} productRepository - Repository for managing products
 * @param {EventStore} eventStore - Event store for logging events
 * @param {ProductReadRepository | ProductReadMongoRepository} productReadRepository - Read repository for managing product stock levels
 */

export class SellProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private eventStore: EventStore,
        private productReadRepository: ProductReadRepository | ProductReadMongoRepository
    ) { }

    public async handle(command: SellProductCommand): Promise<void> {

        let event = new EventsCreator<ProductSoldEvent>("ProductSold", command).create();

        const session = await mongoose.startSession();

        session.startTransaction();

        try {
            const product = await this.productRepository.findById(command.productId);

            if (!product) {
                throw new ProductNotFoundError();
            }

            if (product.stock < command.quantity) {
                throw new InsufficientStockError();
            }

            product.stock -= command.quantity;

            await this.productRepository.update(product, session);
            
            this.productReadRepository.updateStock(product._id.toString(), product.stock);

            await session.commitTransaction();
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