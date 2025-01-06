import { ProductRepository } from '../repositories/product.repository';
import { SellProductCommand } from './sell-product.command';
import mongoose from 'mongoose';

export class SellProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    public async handle(command: SellProductCommand): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const product = await this.productRepository.findById(command.productId);

            //TODO add errors
            if (!product) {
                throw new Error('Product not found');
            }

            //TODO add errors
            if (product.stock < command.quantity) {
                throw new Error('Insufficient stock');
            }

            product.stock -= command.quantity;

            await this.productRepository.update(product, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}