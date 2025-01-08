import * as http from "http";

export type HttpServer = http.Server;
export type NextFunction = (args: CommonNextFunctionArgs) => void;
export type CommonNextFunctionArgs = unknown;
export type BasicAuth = {
    id: string;
    api_key: string;
};

export interface Command { };
export interface CommandHandler<T extends Command> {
    handle(command: T): Promise<void>;
};
export enum ResponseStatus {
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
};
export enum ERROR_CODES {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    PRODUCT_NOT_FOUND = "PRODUCT_NOT_FOUND",
    INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
    VALIDATION_ERROR = "VALIDATION_ERROR"
};

export type ProductRestockedEvent = {
    type: 'ProductRestocked';
    productId: string;
    quantity: number;
    status: "FAILED" | "SUCCESS";
    timestamp: Date;
    error?: null | unknown;
};
export type ProductSoldEvent = {
    type: 'ProductSold';
    productId: string;
    quantity: number;
    status: "FAILED" | "SUCCESS";
    timestamp: Date;
    error?: null | unknown;
};
export type ProductCreatedEvent = {
    type: 'ProductCreated';
    productId: string;
    description: string;
    name: string;
    price: number;
    stock: number;
    status: "FAILED" | "SUCCESS";
    timestamp: Date;
    error?: null | unknown;
};
export type OrderCreatedEvent = {
    type: 'OrderCreated';
    customerId: string;
    products: Array<{
        productId: string;
        quantity: number;
    }>;
    status: "FAILED" | "SUCCESS";
    timestamp: Date;
    error?: null | unknown;
};

export type EventStoreData = { events: ProductEvent[]}

export type ProductEvent = 
    ProductRestockedEvent |
    ProductSoldEvent | 
    ProductCreatedEvent | 
    OrderCreatedEvent;