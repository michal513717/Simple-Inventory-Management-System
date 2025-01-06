import { model, Model, Schema } from "mongoose";
import mongoose from "mongoose";

export const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true, maxlength: 50},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
}, {
    timestamps: true,
    versionKey: false
});

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

export const OrderModel: Model<any> = model("orders", OrderSchema);

export const ProductModel: Model<any> = model("products", ProductSchema);