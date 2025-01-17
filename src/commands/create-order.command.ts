

export class CreateOrderCommand {
    constructor(
        public customerId: string,
        public products: Array<{
            productId: string;
            quantity: number;
        }>
    ) { }
}