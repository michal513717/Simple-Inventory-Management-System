import mongoose, { Model } from "mongoose";
import { Product, ProductSchema } from "../models/mongoSchemas";

export class ProductRepository {
    private ProductModel: Model<Product>;

    constructor() {
        this.ProductModel = mongoose.model<Product>('Product', ProductSchema, 'products');
    }

    async create(product: Omit<Product, '_id'>): Promise<Product> {
        return this.ProductModel.create(product);
    }

    async findById(id: string): Promise<Product | null> {
        return this.ProductModel.findById(id).exec();
    }

    async update(id: string, product: Partial<Omit<Product, '_id'>>): Promise<Product | null> {
        return this.ProductModel.findByIdAndUpdate(id, product, { new: true }).exec();
    }
    async delete(id: string): Promise<Product | null> {
        return this.ProductModel.findByIdAndDelete(id).exec();
    }
}