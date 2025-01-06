import { ProductReadRepository } from "../repositories/product-read.repository";
import { ProductRepository } from "../repositories/product.repository";

export class RestockProductCommand {
    constructor(
        private productRepository: ProductRepository,
        private productReadRepository: ProductReadRepository
    ) { }

    public async execute(id: string, quantity: number): Promise<void> {

        // Not sure about it. It could be to productReadRepository, but it's a different
        // functionality system. It's not a read operation. It's part of create operation.
        const product = await this.productRepository.findById(id);

        //TODO Add custom Errors

        if (!product) {
            throw new Error("Product not found");
        }

        if (quantity < 0) {
            throw new Error("Quantity must be a positive number");
        }

        const updatedProduct = await this.productRepository.update(id, { stock: product.stock + quantity });

        if (updatedProduct) {
            await this.productReadRepository.index(updatedProduct);
        }
    }
}