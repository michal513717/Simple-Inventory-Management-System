import { ProductReadRepository } from "../repositories/product-read.repository";
import { ProductRepository } from "../repositories/product.repository";
import mongoose from "mongoose";
import { RestockProductCommand } from "./restock-product.command";
import { ProductNotFoundError } from "../utils/errorsWithCode";
import { EventStore } from "../databases/eventStore";
import { ProductRestockedEvent } from "../models/common.models";
import { EventsCreator } from "../utils/events";

export class RestockProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private eventStore: EventStore
    ) { }

    public async handle(command: RestockProductCommand): Promise<void> {

        const session = await mongoose.startSession();

        session.startTransaction();

        const event = new EventsCreator<ProductRestockedEvent>("ProductRestocked", command).create();

        try {
            const product = await this.productRepository.findById(command.productId);

            if (!product) {
                throw new ProductNotFoundError();
            }

            product.stock += command.quantity;

            const updatedProduct = await this.productRepository.update(product, session);

            if (!updatedProduct) {
                throw new Error("Could not update product")//TODO add cusotm errors
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            event.status = "FAILED";
            throw error;
        } finally {
            session.endSession();
            await this.eventStore.append(event);
        }
    }
}