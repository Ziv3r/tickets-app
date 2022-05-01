import mongoose from "mongoose";
import { OrderStatus } from "@zivhals-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// An interface that describes the properits for the User
interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document<any> {
    version: string;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (order: OrderAttrs): mongoose.Document => {
    return new Order({
        _id: order.id,
        version: order.version,
        price: order.price,
        userId: order.userId,
        status: order.status
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
