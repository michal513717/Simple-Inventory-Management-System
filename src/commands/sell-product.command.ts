export class SellProductCommand {
    constructor(
        public productId: string,
        public quantity: number
    ) { }
}