import mongoose, { Model, ClientSession } from "mongoose";
import { Product, ProductSchema } from "../models/mongoSchemas";

/**
 * @fileOverview ProductUpdateRepository - Handles CRUD operations for products in the database.
 * 
 * @author Michał Kuś
 * @class
 * @param {Model<Product>} productModel - Model representing the product schema
 */

export class ProductUpdateRepository {
    private productUpdateModel: Model<Product>;

    constructor() {
        this.productUpdateModel = mongoose.model<Product>('Product', ProductSchema, 'products');
    }

    public async create(product: Omit<Product, '_id'>): Promise<Product> {
        return this.productUpdateModel.create(product);
    }

    public async findById(id: string): Promise<Product | null> {
        return this.productUpdateModel.findById(id);
    }

    async update(product: Product, session?: ClientSession): Promise<Product | null> {
        return session
            ? this.productUpdateModel.findByIdAndUpdate(product._id, product, { new: true, session })
            : this.productUpdateModel.findByIdAndUpdate(product._id, product, { new: true });
    }
}