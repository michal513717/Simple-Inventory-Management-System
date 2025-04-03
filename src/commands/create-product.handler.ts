import { Product } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { ProductReadRepository } from "../repositories/product-read.repository";
import * as log4js from 'log4js';
import { EventStore } from '../databases/eventStore';
import { EventsCreator } from '../utils/events';
import { ProductCreatedEvent } from '../models/common.models';
import { ProductReadMongoRepository } from '../repositories/product-read.mongo.repository';
import { ProductDoenstHaveId } from '../utils/errorsWithCode';

/**
 * @fileOverview CreateProductCommand - Handles the creation of new products, indexing them, and logging events.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductRepository} productRepository - Repository for managing products
 * @param {ProductReadRepository | ProductReadMongoRepository} productReadRepository - Read repository for managing product stock levels
 * @param {EventStore} eventStore - Event store for logging events
 */

const logger = log4js.getLogger();

export class CreateProductCommandHandler {
    constructor(
        private productRepository: ProductRepository,
        private productReadRepository: ProductReadRepository | ProductReadMongoRepository,
        private eventStore: EventStore
    ) { }

    public async handle(command: Product): Promise<any> {

        const event = new EventsCreator<ProductCreatedEvent>("ProductCreated", {
            productId: command.name,
            description: command.description,
            name: command.name,
            price: command.price,
            stock: command.stock
        }).create();

        try {
            const createdProduct = await this.productRepository.create(command);
            
            if(!createdProduct._id){
                throw new ProductDoenstHaveId();
            }

            throw new Error("Error during creating product");
        } catch (error) {
            logger.error("Error during creating product:", error);
            event.status = "FAILED";
            event.error = error;
            throw error;
        } finally {
            this.eventStore.append(event);
        }
    }

    // public async execute(command: Product): Promise<Product> {

    //     const event = new EventsCreator<ProductCreatedEvent>("ProductCreated", {
    //         productId: command.name,
    //         description: command.description,
    //         name: command.name,
    //         price: command.price,
    //         stock: command.stock
    //     }).create();

    //     try {
    //         const createdProduct = await this.productRepository.create(command);
            
    //         if(!createdProduct._id){
    //             throw new ProductDoenstHaveId();
    //         }

    //         if (createdProduct._id) {
    //             await this.productReadRepository.index(createdProduct);
    //             return createdProduct;
    //         }

    //         throw new Error("Error during creating product");
    //     } catch (error) {

    //         if(error instanceof ProductDoenstHaveId) {
    //             logger.error("Error during creating product: Missing _id after saving to MongoDB");
    //         }

    //         logger.error("Error during creating product:", error);
    //         event.status = "FAILED";
    //         event.error = error;
    //         throw error;
    //     } finally {
    //         this.eventStore.append(event);
    //     }
    // }
}