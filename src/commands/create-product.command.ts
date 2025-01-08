import { Product } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { ProductReadRepository } from "../repositories/product-read.repository";
import * as log4js from 'log4js';
import { EventStore } from '../databases/eventStore';
import { EventsCreator } from '../utils/events';
import { ProductCreatedEvent } from '../models/common.models';

const logger = log4js.getLogger();

export class CreateProductCommand {
    constructor(
        private productRepository: ProductRepository,
        private productReadRepository: ProductReadRepository,
        private eventStore: EventStore
    ) { }

    public async execute(command: Product): Promise<Product> {

        const event = new EventsCreator<ProductCreatedEvent>("ProductCreated", {
            productId: command.name,
            description: command.description,
            name: command.name,
            price: command.price,
            stock: command.stock
        }).create();

        try {
            const createdProduct = await this.productRepository.create(command);
            if (createdProduct._id) {
                await this.productReadRepository.index(createdProduct);
                return createdProduct;
            }
            logger.error("Error during creating product: Missing _id after saving to MongoDB");
            throw new Error("Error during creating product");
        } catch (error) {
            logger.error("Error during creating product:", error);
            event.status = "FAILED";
            throw error;
        } finally {
            this.eventStore.append(event);
        }
    }
}