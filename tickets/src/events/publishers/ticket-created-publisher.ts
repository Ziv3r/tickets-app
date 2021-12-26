import { Publisher, Subjects, TicketCreatedEvent } from '@ziv-tickets/common';
import { Message } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated =  Subjects.TicketCreated;
}
