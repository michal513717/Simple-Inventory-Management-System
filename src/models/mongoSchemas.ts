import { model, Model, Schema } from "mongoose";
import { Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface Product extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export const ProductSchema = new Schema<Product>({
    name: { type: String, required: true },
    description: { type: String, required: true, maxlength: 50 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
}, {
    versionKey: false
});


export const StockSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
}, {
    versionKey: false
})

export const OrderSchema = new Schema({
    customerId: String,
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    createdAt: Date,
}, {
    timestamps: true,
    versionKey: false
});