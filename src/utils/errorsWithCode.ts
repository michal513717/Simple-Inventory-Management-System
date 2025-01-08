import { ERROR_CODES, ResponseStatus } from "../models/common.models";

/**
 * @fileOverview Error Classes - Defines custom error classes with specific error codes and response statuses.
 * 
 * @author Michał Kuś
 * @class
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {ERROR_CODES} code - Custom error code
 */

export abstract class ErrorWithCode extends Error {
    constructor(message: string, public status: number, public code: ERROR_CODES) {
        super(message);
    }

    public toJSON() {
        return {
            status: ResponseStatus.FAILED,
            message: this.message,
            code: this.code
        }
    }
};

export class ProductNotFoundError extends ErrorWithCode {
    constructor(){
        super("Product not found", 403, ERROR_CODES.PRODUCT_NOT_FOUND); //ALSO can be 204, but 204 doesn't have json field
    }
};

export class InsufficientStockError extends ErrorWithCode {
    constructor(){
        super("Insufficient stock", 404, ERROR_CODES.INSUFFICIENT_STOCK);
    }
};

export class ValidationError extends ErrorWithCode {
    constructor(){
        super("Insufficient stock", 403, ERROR_CODES.VALIDATION_ERROR);
    }
};