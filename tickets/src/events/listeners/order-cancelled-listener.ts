import {  Listener, OrderCancelledEvent, Subjects } from '@zivhals-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { TicketMongo } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled ;
    queueGroupName = queueGroupName;
    
    async onMessage (data: OrderCancelledEvent['data'], msg: Message) {
        console.log("Tickets service, GET Order Cancelled EVENT ")

        //find the ticket that the order is reserving.
        const ticket = await TicketMongo.findById(data.ticket.id);

        // If no ticket ---> throw an error 
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        //Mark the ticket as being reserved by setting its orderId property 
        ticket.set({orderId: undefined});

        //save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id, 
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        // ack the message 
        msg.ack();
        
    };
}