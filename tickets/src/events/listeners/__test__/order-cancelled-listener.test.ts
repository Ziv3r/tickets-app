import { OrderCancelledEvent, OrderStatus } from '@zivhals-tickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper';
import { TicketMongo } from '../../../models/ticket'
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () =>{
    //Create an instance of the listener 
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    // Create and save a ticket
    const ticket = TicketMongo.build({
        title: 'concert',
        price: 99,
        userId: 'testUser'
    })

    ticket.set({orderId});

    await ticket.save();

    // create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { orderId, listener, ticket, data, msg}
}


it('updates the ticket, publishes an event, and acks the message', async () => {
    const { orderId, listener, ticket, data, msg} = await setup()

    await listener.onMessage(data, msg);

    const updatedTicket = await TicketMongo.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(undefined);
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})
