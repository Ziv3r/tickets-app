import mongoose from "mongoose";
import { OrderStatus } from "@zivhals-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// An interface that describes the properits for the User
interface PaymentsAttrs {
    orderId: string;
    stripeId: string;
}

interface PaymentsDoc extends mongoose.Document<any> {
    orderId: string;
    stripeId: string;
}

interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
    build(attrs: PaymentsAttrs): PaymentsDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        stripeId: {
            type: String,
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

paymentSchema.statics.build = (attrs: PaymentsAttrs): mongoose.Document => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentsDoc, PaymentsModel>(
    "Payment",
    paymentSchema
);

export { Payment };
