import { EventStore } from '../databases/eventStore';
import { ProductSoldEvent } from '../models/common.models';
import { ProductReadRepository } from '../repositories/product-read.repository';
import { ProductRepository } from '../repositories/product.repository';
import { InsufficientStockError, ProductNotFoundError } from '../utils/errorsWithCode';
import { EventsCreator } from '../utils/events';
import { SellProductCommand } from './sell-product.command';
import mongoose from 'mongoose';

export class SellProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private eventStore: EventStore,
        private productReadRepository: ProductReadRepository
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
            throw error;
        } finally {
            session.endSession();
            this.eventStore.append(event);
        }
    }
}