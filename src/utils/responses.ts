import { ERROR_CODES, ResponseStatus } from "../models/common.models";
import type { Response } from "express";

export function internalServerErrorResponse(res: Response) {
    return res.status(500).json({
        status: ResponseStatus.FAILED,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error, please try again later"
    })
}

export function validationErrorResponse(res: Response, data: any) { 
    return res.status(403).json({
        status: ResponseStatus.FAILED,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: data
    })
}