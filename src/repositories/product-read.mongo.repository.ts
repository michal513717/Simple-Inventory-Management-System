import { Client } from '@elastic/elasticsearch';
import { ObjectId } from 'mongodb';
import { Product } from '../models/mongoSchemas';
import * as log4js from 'log4js';

/**
 * @fileOverview ProductReadRepository - Handles operations related to reading product data, indexing, updating stock, and fetching all products from Elasticsearch.
 * 
 * @author Michał Kuś
 * @class
 * @param {Client} client - Elasticsearch client for database operations
 */

const logger = log4js.getLogger();

export class ProductReadMongoRepository {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async index(product: Product): Promise<any> {
        try {

        } catch (error) {
            return null;
        }
    }

    async updateStock(productId: string, newStock: number): Promise<any> {
        try {
           
        } catch (error) {
            return false;
        }
    }

    async getAll(): Promise<any[]> {
        try {

        } catch (error) {
            return [];
        }
    }
}