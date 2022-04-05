import { Publisher, Subjects, TicketUpdatedEvent } from '@zivhals-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated =  Subjects.TicketUpdated;
}
