import { Product } from '../models/mongoSchemas';
import { ProductReadRepository } from '../repositories/product-read.repository';

export class GetProductsQuery {
    constructor(
        private productReadRepository: ProductReadRepository
    ) { }

    async execute(): Promise<Product[]> {
        return this.productReadRepository.getAll();
    }
}