

export class RestockProductCommand{
    constructor(
        public productId: string,
        public quantity: number
    ) { }
}