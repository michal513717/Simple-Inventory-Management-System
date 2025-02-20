import mongoose, { Model, ClientSession } from "mongoose";
import { Product, ProductSchema } from "../models/mongoSchemas";

/**
 * @fileOverview ProductRepository - Handles CRUD operations for products in the database.
 * 
 * @author Michał Kuś
 * @class
 * @param {Model<Product>} productModel - Model representing the product schema
 */

export class ProductRepository {
    private productModel: Model<Product>;

    constructor() {
        this.productModel = mongoose.model<Product>('Product', ProductSchema, 'products');
    }

    public async create(product: Omit<Product, '_id'>): Promise<Product> {
        return this.productModel.create(product);
    }

    public async findById(id: string): Promise<Product | null> {
        return this.productModel.findById(id);
    }

    async update(product: Product, session?: ClientSession): Promise<Product | null> {
        return session
            ? this.productModel.findByIdAndUpdate(product._id, product, { new: true, session })
            : this.productModel.findByIdAndUpdate(product._id, product, { new: true });
    }
}