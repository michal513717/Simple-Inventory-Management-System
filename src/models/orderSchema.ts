import { model, Model, Schema } from "mongoose";

export const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true, maxlength: 50},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
}, {
    timestamps: true,
    versionKey: false
});

export const ProductModel: Model<any> = model("products", ProductSchema);