import {
    Listener,
    OrderCreatedEvent,
    OrderStatus,
    Subjects
} from "@zivhals-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupNmae } from "./queue-group-name";
import { Order } from "../../src/models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupNmae;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        msg.ack();
    }
}
