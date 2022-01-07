import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@ziv-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated ;
    queueGroupName = queueGroupName;
    
    async onMessage (data: TicketCreatedEvent['data'], msg: Message) {
        console.log("Order service, GET TICKET CREATED EVENT ")
        const {id, title, price} = data;
        const ticket = Ticket.build({
            id, title, price
        })
        await ticket.save();
        msg.ack();
    };
}