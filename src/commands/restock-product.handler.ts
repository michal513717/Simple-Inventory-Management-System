import { ProductReadRepository } from "../repositories/product-read.repository";
import { ProductRepository } from "../repositories/product.repository";
import mongoose from "mongoose";
import { RestockProductCommand } from "./restock-product.command";

export class RestockProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    public async handle(command: RestockProductCommand): Promise<void> {

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const product = await this.productRepository.findById(command.productId);

            if (!product) { //TODO add cusotm errors
                throw new Error('Product not found');
            }

            product.stock += command.quantity;

            const updatedProduct = await this.productRepository.update(product, session);

            if (!updatedProduct) {
                throw new Error("Could not update product")//TODO add cusotm errors
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}