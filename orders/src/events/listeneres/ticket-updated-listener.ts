import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@ziv-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated ;
    queueGroupName = queueGroupName;
    
    async onMessage (data: TicketUpdatedEvent['data'], msg: Message) {
        console.log("Order service, GET TICKET UPDATED EVENT ")
        const ticket = await Ticket.findById(data.id);
        const {title, price} = data;

        if(!ticket){
            throw new Error('Ticket not found');
        }
        ticket.set({title, price});
        await ticket.save();
        msg.ack();
    };
}