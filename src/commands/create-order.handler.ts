import { Order } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { OrderRepository } from '../repositories/order.repository';
import mongoose from 'mongoose';
import { CreateOrderCommand } from './create-order.command';

export class CreateOrderCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private orderRepository: OrderRepository
    ) { }

    async handle(command: CreateOrderCommand): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (const productInfo of command.products) {
                const product = await this.productRepository.findById(productInfo.productId);
                //TODO custom errors
                if (!product) {
                    throw new Error(`Product ${productInfo.productId} not found`);
                }

                if (product.stock < productInfo.quantity) {
                    throw new Error(`Insufficient stock for product ${productInfo.productId}`);//TODO add cusotm errors
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
            session.endSession();
            throw error;
        }
    }
}