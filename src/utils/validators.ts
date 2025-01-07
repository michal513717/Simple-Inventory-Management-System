import { body, param } from 'express-validator';

export const newProductValidator = [
    body('name')
        .notEmpty().withMessage('Name cannot be empty.')
        .isString().withMessage('Name must be a string.')
        .isLength({ max: 50 }).withMessage('Maximum name length is 50.'),

    body('description')
        .notEmpty().withMessage('Description cannot be empty.')
        .isString().withMessage('Description must be a string.')
        .isLength({ max: 50 }).withMessage('Maximum description length is 50.'),

    body('price')
        .notEmpty().withMessage('Price cannot be empty.')
        .isNumeric().withMessage('Price must be a number.')
        .isFloat({ min: 0.01 }).withMessage('Price must be positive.'),

    body('stock')
        .notEmpty().withMessage('Stock cannot be empty.')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
];

export const restockProductValidator = [
    param('id')
        .notEmpty()
        .withMessage('Product ID is required'),
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

export const sellProductValidator = [
    param('id')
        .notEmpty().withMessage('Product ID is required')
        .isString().withMessage('Must be a string'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

export const createOrderValidator = [
    body('customerId')
        .notEmpty().withMessage('Customer ID is required.')
        .isString().withMessage('Customer ID must be a string'),
    body('products')
        .notEmpty().withMessage('Products are required.')
        .isArray().withMessage('Products must be an array.')
        .custom((products: any[]) => {
            if (products.length === 0) {
                throw new Error('At least one product is required.');
            }
            products.forEach((product, index) => {
                if (!product.productId) {
                    throw new Error(`Product at index ${index} must have a productId.`);
                }
                if (!product.quantity) {
                    throw new Error(`Product at index ${index} must have a quantity.`);
                }
                if (typeof product.quantity !== 'number' || product.quantity <= 0 || !Number.isInteger(product.quantity)) {
                    throw new Error(`Quantity for product at index ${index} must be a positive integer.`);
                }
                if (typeof product.productId !== 'string' && !/^[0-9a-fA-F]{24}$/.test(product.productId)) {
                    throw new Error(`ProductId for product at index ${index} must be a valid MongoId.`);
                }
            });
            return true;
        }),
];