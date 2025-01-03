import mongoose, { Model, model, Schema } from "mongoose";

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