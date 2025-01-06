import mongoose, { Model, ClientSession } from "mongoose";
import { OrderSchema, Order } from "../models/mongoSchemas";


export class OrderRepository {

    private orderModel: Model<Order>;

    constructor() {
        this.orderModel = mongoose.model<Order>("Order", OrderSchema, 'orders');
    }

    async create(orderData: Order, session?: ClientSession): Promise<Order> {
        if (session) {
            const createdOrder = new this.orderModel(orderData);
            return await createdOrder.save({ session });
        }

        const createdOrder = new this.orderModel(orderData);
        return await createdOrder.save();
    }

    public async findById(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).exec();
    }

    async update(id: string, order: Partial<Omit<Order, '_id'>>, session?: mongoose.ClientSession): Promise<Order | null> {
        return this.orderModel.findByIdAndUpdate(id, order, { new: true, session }).exec();
    }
}
