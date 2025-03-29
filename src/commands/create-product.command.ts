
export class CreateProductCommand {
    constructor(
        public productId: string,
        public description: string,
        public name: string,
        public price: number,
        public stock: number
    ) { }
}