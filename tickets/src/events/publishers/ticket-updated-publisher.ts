import { Publisher, Subjects, TicketUpdatedEvent } from '@ziv-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated =  Subjects.TicketUpdated;
}
