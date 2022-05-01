import { Listener, OrderCreatedEvent, Subjects } from "@zivhals-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("expiration service, GET Order CREATED EVENT ");

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`waiting for ${delay} to publish`);

        await expirationQueue.add({ orderId: data.id }, { delay });
        msg.ack();
    }
}
