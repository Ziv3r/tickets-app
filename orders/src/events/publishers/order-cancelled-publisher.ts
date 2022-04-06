import { Publisher, OrderCancelledEvent, Subjects } from '@zivhals-tickets/common' 

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;  
}