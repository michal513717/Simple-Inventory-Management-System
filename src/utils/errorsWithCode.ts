import { ERROR_CODES, ResponseStatus } from "../models/common.models";

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
        super("Product not found", 204, ERROR_CODES.PRODUCT_NOT_FOUND);
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