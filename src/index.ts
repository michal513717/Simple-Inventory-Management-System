import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import express from 'express';
import { getMongoClient } from './databases/mongo';
import { getElasticSearchClient } from './databases/elasticSearch';
import { configureLogger } from './utils/logger';
import { configureNotValidRoute, debugRequest } from './utils/requests';
import { APPLICATION_CONFIG } from './utils/applicationConfig';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';
const elasticSearchCloudId = process.env.ELASTICSEARCH_CLOUD_ID || '';
const elasticSearchId = process.env.ELASTICSEARCH_ID || '';
const elasticSearchApiKey = process.env.ELASTICSEARCH_API_KEY || '';


async function main() {
    configureLogger();

    const logger = log4js.getLogger("Main");

    try {
        const elasticSearchClient = await getElasticSearchClient(elasticSearchCloudId, { id: elasticSearchId, api_key: elasticSearchApiKey });

        const mongoClient = await getMongoClient(mongoUri);

        configureNotValidRoute(app);

        if(APPLICATION_CONFIG.DEBUG_REQUEST === true){ 
            debugRequest(app);
        }

        app.listen(port, () => {
            logger.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        logger.error("error during connection", error);
    }
}

main().catch((error) => {
    console.log(error);
});