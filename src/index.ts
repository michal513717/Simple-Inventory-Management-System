import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import express from 'express';
import { getMongoClient } from './databases/mongo';
import { getElasticSearchClient } from './databases/elasticSearch';
import { configureLogger } from './utils/logger';
import { configureNotValidRoute, debugRequest } from './utils/requests';
import { APPLICATION_CONFIG } from './utils/applicationConfig';
import { ProductRepository } from './repositories/product.repository';
import { ProductReadRepository } from './repositories/product-read.repository';
import { CreateProductCommand } from './commands/create-product.command';
import { GetProductsQuery } from './queries/get-product.query';
import { ProductController } from './controllers/product.controller';
import { RestockProductCommand } from './commands/restock-product.command';
import { SellProductCommand } from './commands/sell-product.command';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';
const elasticSearchCloudId = process.env.ELASTICSEARCH_CLOUD_ID || '';
const elasticSearchId = process.env.ELASTICSEARCH_ID || '';
const elasticSearchApiKey = process.env.ELASTICSEARCH_API_KEY || '';


async function main() {
    configureLogger();

    app.use(express.json());

    const logger = log4js.getLogger("Main");

    try {
        const elasticSearchClient = await getElasticSearchClient(elasticSearchCloudId, { id: elasticSearchId, api_key: elasticSearchApiKey });

        const mongoClient = await getMongoClient(mongoUri);

        const productRepository = new ProductRepository();
        const productReadRepository = new ProductReadRepository(elasticSearchClient);
        const restockProductCommand = new RestockProductCommand(productRepository, productReadRepository);
        const createProductCommand = new CreateProductCommand(productRepository, productReadRepository);
        const sellProductCommand = new SellProductCommand(productRepository, productReadRepository);
        const getProductsQuery = new GetProductsQuery(productReadRepository);
        const productController = new ProductController(createProductCommand, getProductsQuery, restockProductCommand, sellProductCommand);

        if(APPLICATION_CONFIG.DEBUG_REQUEST === true){ 
            debugRequest(app);
        }

        app.post('/products', productController.createProduct.bind(productController));
        app.get('/products', productController.getProducts.bind(productController));
        
        app.post('/products/:id/restock', productController.restockProduct.bind(productController));
        app.post('/products/:id/sell', productController.sellProduct.bind(productController));

        configureNotValidRoute(app);

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