import { model, Model, Schema } from "mongoose";
import { Document, Types } from 'mongoose';
import mongoose from "mongoose";

export type Product = Document & {
    _id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
};

export type Order = Document & {
    _id: Types.ObjectId;
    customerId: string;
    products: {
        productId: Types.ObjectId;
        quantity: number;
    }[];
    createdAt: Date;
};

export const ProductSchema = new Schema<Product>({
    name: { type: String, required: true },
    description: { type: String, required: true, maxlength: 50 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
}, {
    versionKey: false,
    collection: 'products'
});

export const OrderSchema = new Schema<Order>({
    customerId: String,
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    createdAt: Date,
}, {
    collection: 'orders',
    timestamps: true,
    versionKey: false
});