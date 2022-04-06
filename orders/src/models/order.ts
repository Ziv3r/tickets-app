import mongoose from 'mongoose';
import { OrderStatus } from '@zivhals-tickets/common'
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus }; 

// An interface that describes the properits for the User 
interface OrderAttrs {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc; 
}

interface OrderDoc extends mongoose.Document<any> {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc,
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build( attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
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
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
    },
    {
    toJSON:{
        transform(doc, ret) {
             ret.id = ret._id;
             delete ret._id;
        }
    }        
    }
)

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (order: OrderAttrs): mongoose.Document => {
    return new Order(order)
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema) ;

export { Order }; 