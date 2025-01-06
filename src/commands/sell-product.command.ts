import { ProductRepository } from '../repositories/product.repository';
import { ProductReadRepository } from "../repositories/product-read.repository";

export class SellProductCommand {
    constructor(
        private productRepository: ProductRepository,
        private productReadRepository: ProductReadRepository
    ) { }

    public async execute(id: string, quantity: number): Promise<void> {
        const product = await this.productRepository.findById(id);
        
        //TODO erors
        if (!product) {
            throw new Error("Product not found");
        }

        if (quantity < 0 && product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const updatedProduct = await this.productRepository.update(id, { stock: product.stock - quantity });

        if (updatedProduct) {
            await this.productReadRepository.index(updatedProduct);
        }
    }
}