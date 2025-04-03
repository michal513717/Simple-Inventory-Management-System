import { ProductUpdateRepository } from "../repositories/product-update.repository";
import mongoose from "mongoose";
import { RestockProductCommand } from "./restock-product.command";
import { ProductNotFoundError } from "../utils/errorsWithCode";
import { EventStore } from "../databases/eventStore";
import { ProductRestockedEvent } from "../models/common.models";
import { EventsCreator } from "../utils/events";

/**
 * @fileOverview RestockProductCommandHandler - Handles restocking products, managing stock levels, and logging events.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductRepository} productRepository - Repository for managing products
 * @param {EventStore} eventStore - Event store for logging events
 * @param {ProductReadRepository | ProductReadMongoRepository} productReadRepository - Read repository for managing product stock levels
 */

export class RestockProductCommandHandler {
    constructor(
        private productUpdateRepository: ProductUpdateRepository,
        private eventStore: EventStore,
    ) { }

    public async handle(command: RestockProductCommand): Promise<void> {

        const session = await mongoose.startSession();

        session.startTransaction();

        const event = new EventsCreator<ProductRestockedEvent>("ProductRestocked", command).create();

        try {
            const product = await this.productUpdateRepository.findById(command.productId);

            if (!product) {
                throw new ProductNotFoundError();
            }

            product.stock += command.quantity;

            await this.productUpdateRepository.update(product, session);

            // It was a elastic search index, but now we are using MongoDB Atlas Search
            // this.productReadRepository.updateStock(product._id.toString(), product.stock);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            event.status = "FAILED";
            event.error = error;
            throw error;
        } finally {
            session.endSession();
            await this.eventStore.append(event);
        }
    }
}