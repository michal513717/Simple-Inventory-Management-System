import { MongoClient, ServerApiVersion } from 'mongodb';
import { Client as ElasticClient } from '@elastic/elasticsearch';


import * as dotenv from 'dotenv';
import express from 'express';
import { getMongoClient } from './databases/mongo';
import { getElasticSearchClient } from './databases/elasticSearch';
import { configureLogger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';
const elasticSearchCloudId = process.env.ELASTICSEARCH_CLOUD_ID || '';
const elasticSearchId = process.env.ELASTICSEARCH_ID || '';
const elasticSearchApiKey = process.env.ELASTICSEARCH_API_KEY || '';


async function main() {
    configureLogger();
    try {
        const mongoClient = await getMongoClient(mongoUri);
        const elasticSearchClient = await getElasticSearchClient(elasticSearchCloudId, {id: elasticSearchId, api_key: elasticSearchApiKey});        

        await elasticSearchClient.ping();


    } catch (error) {
        
    }

    



}

main().catch((error) => {
    console.log(error);
});