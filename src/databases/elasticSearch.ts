import { Client as ElasticClient } from '@elastic/elasticsearch';
import { BasicAuth } from '../models/common.models';
import * as log4js from 'log4js';

/**
 * @fileOverview getElasticSearchClient - Establishes connection to ElasticSearch using cloud ID and credentials.
 * 
 * @author Michał Kuś
 * @function
 * @param {string} cloudId - The cloud ID for ElasticSearch
 * @param {BasicAuth} credentials - The credentials for authentication
 * @returns {Promise<ElasticClient>} - Returns a promise that resolves to an ElasticClient instance
 */

const logger = log4js.getLogger("Database");

export const getElasticSearchClient = async (cloudId: string, credentials: BasicAuth): Promise<ElasticClient> => {
    try {

        const elasticSearchClient = await new ElasticClient({
            cloud: { id: cloudId },
            auth: { apiKey: credentials }
        });

        logger.info("ElasticSearch connected");
        return elasticSearchClient;
    } catch (error) {
        logger.error("ElasticSearch connection failed");
        logger.error(error);
        process.exit(1);
    }
}