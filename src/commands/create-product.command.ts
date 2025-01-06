import { Product } from '../models/mongoSchemas';
import { ProductRepository } from '../repositories/product.repository';
import { ProductReadRepository } from "../repositories/product-read.repository";
import * as log4js from 'log4js';

const logger = log4js.getLogger();

export class CreateProductCommand {
    constructor(
        private productRepository: ProductRepository,
        private productReadRepository: ProductReadRepository
    ) { }

    public async execute(productData: Product): Promise<Product> {
        try {
            const createdProduct = await this.productRepository.create(productData);
            if (createdProduct._id) {
                await this.productReadRepository.index(createdProduct);
                return createdProduct;
            }
            logger.error("Error during creating product: Missing _id after saving to MongoDB");
            throw new Error("Error during creating product");
        } catch (error) {
            logger.error("Error during creating product:", error);
            throw error;
        }
    }
}