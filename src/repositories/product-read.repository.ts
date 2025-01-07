import { Client } from '@elastic/elasticsearch';
import { ObjectId } from 'mongodb';
import { Product } from '../models/mongoSchemas';
import * as log4js from 'log4js';

const logger = log4js.getLogger();

export class ProductReadRepository {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
        // this.client.deleteByQuery({ //! Celan up function
        //     index: 'products', query: { "match_all": {} }
        // })
    }

    async index(product: Product): Promise<any> {
        try {
            const id = product._id instanceof ObjectId ? product._id.toHexString() : product._id;
            return this.client.index({
                index: 'products',
                id,
                document: {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                },
            });
        } catch (error) {
            logger.error("Error while indexing the product in Elasticsearch: ", error);
            return null;
        }
    }

    async updateStock(productId: string, newStock: number): Promise<boolean> {
        try {
            const updateResponse = await this.client.update({
                index: 'products',
                id: productId,
                body: {
                    script: {
                        source: 'ctx._source.stock = params.newStock', // Update script using painless
                        params: {
                            newStock,
                        },
                    },
                },
            });
            return updateResponse.result === 'updated';
        } catch (error) {
            logger.error("Error updating product stock in Elasticsearch:", error);
            return false;
        }
    }

    async getAll(): Promise<Product[]> {
        try {
            const result = await this.client.search({
                index: 'products',
                query: { match_all: {} },
            });

            //TODO: Fix the type of the result
            //@ts-ignore
            return result.hits.hits.map((hit: any) => ({
                _id: hit._id,
                name: hit._source.name,
                description: hit._source.description,
                price: hit._source.price,
                stock: hit._source.stock,
            }));
        } catch (error) {
            logger.error("Error downloading products from Elasticsearch: ", error);
            return [];
        }
    }
}