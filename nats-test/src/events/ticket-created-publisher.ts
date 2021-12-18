import { Publisher } from './base-publisher';
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects} from './subjects'
import { Message } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated =  Subjects.TicketCreated;
}
