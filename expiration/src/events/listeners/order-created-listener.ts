import {  Listener, OrderCreatedEvent, Subjects } from '@zivhals-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated ;
    queueGroupName = queueGroupName;
    
    async onMessage (data: OrderCreatedEvent['data'], msg: Message) {
        console.log("expiration service, GET Order CREATED EVENT ")
        
    };
}