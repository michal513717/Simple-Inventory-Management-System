import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import express from 'express';
import { getMongoClient } from './databases/mongo';
import { getElasticSearchClient } from './databases/elasticSearch';
import { configureLogger } from './utils/logger';
import { configureNotValidRoute, debugRequest } from './utils/requests';
import { APPLICATION_CONFIG } from './utils/applicationConfig';
import { ProductUpdateRepository } from './repositories/product-update.repository';
import { ProductReadRepository } from './repositories/product-read.repository';
import { CreateProductCommand } from './commands/create-product.command';
import { GetProductsQuery } from './queries/get-product.query';
import { ProductController } from './controllers/product.controller';
import { RestockProductCommand } from './commands/restock-product.command';
import { SellProductCommandHandler } from './commands/sell-product.handler';
import { commandDispatchManager } from './managers/commandDispatchManager';
import { CreateOrderCommandHandler } from './commands/create-order.handler';
import { OrderRepository } from './repositories/order.repository';
import { RestockProductCommandHandler } from './commands/restock-product.handler';
import { SellProductCommand } from './commands/sell-product.command';
import { CreateOrderCommand } from './commands/create-order.command';
import { OrderController } from './controllers/order.controller';
import { EventStore } from './databases/eventStore';
import { CreateProductCommandHandler } from './commands/create-product.handler';
import { ProductReadMongoRepository } from './repositories/product-read.mongo.repository';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || '';
const elasticSearchCloudId = process.env.ELASTICSEARCH_CLOUD_ID || '';
const elasticSearchId = process.env.ELASTICSEARCH_ID || '';
const elasticSearchApiKey = process.env.ELASTICSEARCH_API_KEY || '';


async function main() {
    configureLogger();

    app.use(express.json());

    const logger = log4js.getLogger("Main");

    try {
        const elasticSearchClient = await getElasticSearchClient(elasticSearchCloudId, { 
            id: elasticSearchId, api_key: elasticSearchApiKey 
        });

        const mongoClient = await getMongoClient(mongoUri);
        const eventStore = new EventStore('events.json');

        const productRepository = new ProductUpdateRepository();
        const orderRepository = new OrderRepository();
        const productReadRepository = new ProductReadRepository(elasticSearchClient);
        const productReadMongoRepository = new ProductReadMongoRepository();

        const getProductsQuery = new GetProductsQuery(productReadRepository);
                
        const sellProductCommandHandler = new SellProductCommandHandler(productRepository, eventStore, productReadRepository);
        const createOrderCommandHandler = new CreateOrderCommandHandler(productRepository, orderRepository, eventStore, productReadRepository);
        const restockProductCommandHandler = new RestockProductCommandHandler(productRepository, eventStore, productReadRepository);
        const createProductCommandHandler = new CreateProductCommandHandler(productRepository, eventStore);

        const orderController = new OrderController();
        const productController = new ProductController(getProductsQuery);

        commandDispatchManager.registerHandler(RestockProductCommand.name, restockProductCommandHandler);
        commandDispatchManager.registerHandler(SellProductCommand.name, sellProductCommandHandler);
        commandDispatchManager.registerHandler(CreateOrderCommand.name, createOrderCommandHandler);
        commandDispatchManager.registerHandler(CreateProductCommand.name, createProductCommandHandler);

        if(APPLICATION_CONFIG.DEBUG_REQUEST === true){ 
            debugRequest(app);
        }

        app.post('/products', productController.createProduct.bind(productController));
        app.get('/products', productController.getProducts.bind(productController));
        
        app.post('/products/:id/restock', productController.restockProduct.bind(productController));
        app.post('/products/:id/sell', productController.sellProduct.bind(productController));

        app.post('/createOrder', orderController.createOrder.bind(orderController));

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