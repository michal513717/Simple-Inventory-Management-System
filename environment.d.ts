declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ELASTICSEARCH_ID: string;
            ELASTICSEARCH_API_KEY: string;
            ELASTICSEARCH_CLOUD_ID: string;
            MONGODB_URI: string;
            MONGODB_DB_NAME: string;
        }
    }
}

export {};