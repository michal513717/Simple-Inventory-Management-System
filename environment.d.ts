declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ELASTIC_SEARCH_ID: string;
            ELASTIC_SEARCH_NAME: string;
            ELASTIC_SEARCH_EXPIRATION: number;
            ELASTIC_SEARCH_API_KEY: string;
            ELASTIC_SEARCH_ENCODED: string;
            ELASTIC_SEARCH_BEATS_LOGSTASH_FORMAT: string;
            ELASTIC_SEARCH_CLOUD_ID: string;
            MONGODB_URI: string;
            MONGODB_DB_NAME: string;
        }
    }
}

export {};