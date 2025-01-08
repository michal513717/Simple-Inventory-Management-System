import { ERROR_CODES, ResponseStatus } from "../models/common.models";
import type { Response } from "express";

/**
 * @fileOverview Error Responses - Contains functions to handle different types of error responses for the Express server.
 * 
 * @author Michał Kuś
 * @module ErrorResponses
 * @exports internalServerErrorResponse - Sends a 500 Internal Server Error response
 * @exports validationErrorResponse - Sends a 403 Validation Error response
 */

export function internalServerErrorResponse(res: Response) {
    return res.status(500).json({
        result: {
            status: ResponseStatus.FAILED,
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error, please try again later"
        }
    })
}

export function validationErrorResponse(res: Response, data: any) { 
    return res.status(403).json({
        result: {
            status: ResponseStatus.FAILED,
            code: ERROR_CODES.VALIDATION_ERROR,
            message: data
        }
    })
}