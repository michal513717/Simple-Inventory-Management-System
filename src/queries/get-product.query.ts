import { Product } from '../models/mongoSchemas';
import { ProductReadRepository } from '../repositories/product-read.repository';

/**
 * @fileOverview GetProductsQuery - Handles fetching all products from the product read repository.
 * 
 * @author Michał Kuś
 * @class
 * @param {ProductReadRepository} productReadRepository - Read repository for fetching products
 */

export class GetProductsQuery {
    constructor(
        private productReadRepository: ProductReadRepository
    ) { }

    async execute(): Promise<Product[]> {
        return this.productReadRepository.getAll();
    }
}