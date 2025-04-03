import mongoose, { Model } from 'mongoose';
import { Product, ProductSchema } from '../models/mongoSchemas';
import * as log4js from 'log4js';

/**
 * @fileOverview ProductReadMongoRepository - Handles operations related to reading product data
 * 
 * @author Michał Kuś
 * @class
 * @param {Client} client
 */

const logger = log4js.getLogger();

export class ProductReadMongoRepository {

    private productReadModel: Model<Product>;

    constructor() {
        this.productReadModel = mongoose.model<Product>('Product', ProductSchema, 'products');
    }

    async getAll(): Promise<any> {
        try {
            return await this.productReadModel.find().lean();
        } catch (error) {
            logger.error("Error fetching all products", error);
            return [];
        }
    }

    async getById(productId: string): Promise<Product | null> {
        try {
            return await this.productReadModel.findById(productId).lean();
        } catch (error) {
            logger.error("Error fetching product by ID", error);
            return null;
        }
    }
}