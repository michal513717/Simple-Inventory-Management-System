import { Product } from '../models/mongoSchemas';
import { ProductReadMongoRepository } from '../repositories/product-read.mongo.repository';
import { ProductReadRepository } from '../repositories/product-read.repository';

/**
 * @fileOverview GetProductsQuery - Handles fetching all products from the product read repository.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductReadRepository | ProductReadMongoRepository} productReadRepository - Read repository for fetching products
 */

export class GetProductsQuery {
    constructor(
        private productReadRepository: ProductReadRepository | ProductReadMongoRepository
    ) { }

    async execute(): Promise<Product[]> {
        return this.productReadRepository.getAll();
    }
}