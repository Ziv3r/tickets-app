import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// An interface that describes the properits for the User 
interface TicketAttrs {
    id: string,
    title: string,
    price: number,
}

export interface TicketDoc extends mongoose.Document<any> {
    title: string,
    price: number,
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build( attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
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

ticketSchema.statics.build = (ticketAttrs: TicketAttrs): mongoose.Document => {
    return new Ticket({
        _id: ticketAttrs.id,
        title: ticketAttrs.title,
        price: ticketAttrs.price,
    })
};

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.awaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return (!!existingOrder);
} 

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema) ;

export { Ticket }; 