import { Message } from 'node-nats-streaming'
import { Listener } from '../../../common/src/events/base-listener'
import { Subjects } from '../../../common/src/events/subjects';
import { TicketCreatedEvent} from '../../../common/src/events/ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated ;
    queueGroupName = 'orders-service-queue-group';
    
    onMessage (data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event Data', data)
        console.log(data.id)
        console.log(data.title)
        msg.ack();
    };
}