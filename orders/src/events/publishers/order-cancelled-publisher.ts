import { Publisher, OrderCancelledEvent, Subjects } from '@ziv-tickets/common' 

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;  
}