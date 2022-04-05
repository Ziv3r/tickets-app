import { OrderCreatedEvent, OrderStatus } from '@zivhals-tickets/common';
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper';
import { TicketMongo } from '../../../models/ticket'
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () =>{
    //Create an instance of the listener 
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = TicketMongo.build({
        title: 'concert',
        price: 99,
        userId: 'testUser'
    })

    await ticket.save();

    // create the fake data event
    const data: OrderCreatedEvent['data'] = {
         id: new mongoose.Types.ObjectId().toHexString(),
         version: 0,
         status: OrderStatus.Created,
         userId: 'test-user',
         expiresAt: 'fake-date',
         ticket: {
            id: ticket.id,
            price: ticket.price
         }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg}
}


it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await TicketMongo.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id)

})

it('ack the message', async () => {
    const { listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    
})


it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    
    //@ts-ignore
    console.log(natsWrapper.client.publish.mock.calls[0][1])
    console.log(data)
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})