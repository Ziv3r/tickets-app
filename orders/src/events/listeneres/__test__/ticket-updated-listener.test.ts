import mongoose from 'mongoose';
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@zivhals-tickets/common';
import { Message } from 'node-nats-streaming'

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
           id: new mongoose.Types.ObjectId().toHexString(),
           title: 'concert',
           price: 20,
    });

    await ticket.save();

    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'concert-update',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    //create a fake msg object
    // @ts-ignore
        const msg: Message = {
            ack: jest.fn()
        }

    // return all 
    return { ticket, listener, data, msg}
}


it ('finds, updates, and saves a ticket', async () => {
    const { ticket, listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    
    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
    
})

it ('ack the msg ', async () => {
    const { ticket, listener, data, msg} = await setup();
    
    // call the onMessafe function with the data object + message object 
    await listener.onMessage(data, msg)

    //write assertions to make sure ack message was called 
    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
    
    const { listener, data, msg, ticket} = await setup();
    
    data.version = 10;
    
    try {
        // call the onMessafe function with the data object + message object 
        await listener.onMessage(data, msg)
    }catch(err){

    }

    //write assertions to make sure ack message was called 
    expect(msg.ack).not.toHaveBeenCalled();

})
