import {
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    Subjects
} from "@zivhals-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupNmae } from "./queue-group-name";
import { Order } from "../../src/models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupNmae;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const orderToUpdate = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!orderToUpdate) {
            throw new Error(`Order with id ${data.id} does not exist`);
        }

        orderToUpdate.set({ status: OrderStatus.Cancelled });

        await orderToUpdate.save();

        msg.ack();
    }
}
