import { Client as ElasticClient } from '@elastic/elasticsearch';
import { BasicAuth } from '../models/common.models';
import * as log4js from 'log4js';

const logger = log4js.getLogger("db");

export const getElasticSearchClient = async (cloudId: string, credentials: BasicAuth): Promise<ElasticClient> => {
    try {

        const elasticSearchClient = await new ElasticClient({
            cloud: { id: cloudId },
            auth: { apiKey: credentials }
        });

        logger.info("ElasticSearch connected")
        return elasticSearchClient;
    } catch (error) {
        logger.error("ElasticSearch connection failed");
        logger.error(error);
        process.exit(1);
    }
}