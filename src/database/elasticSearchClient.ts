import { Client } from "@elastic/elasticsearch"

export const elasticSearchClient = async () => {
    try {
        await new Client({
            cloud: {
                id: process.env.ELASTIC_SEARCH_CLOUD_ID
            },
            auth: {
                apiKey: {
                    id: process.env.ELASTIC_SEARCH_ID,
                    api_key: process.env.ELASTIC_SEARCH_API_KEY,
                }
            }
        })
        
        console.info("ElasticSearch connection success");
    } catch (error) {
        console.error("ElasticSearch connection failed");
        console.error(error);
        process.exit(1);
    }
}

