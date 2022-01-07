import { Publisher, OrderCreatedEvent, Subjects } from '@ziv-tickets/common' 

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;  
}