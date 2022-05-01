import { natsWrapper } from "../../../src/nats-wrapper";
import { OrderCreatedListener } from "../order-cancelled-listener";
import {
    OrderCancelledEvent,
    OrderCreatedEvent,
    OrderStatus
} from "@zivhals-tickets/common";
import mongoose from "mongoose";
import { Order } from "../../../src/models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: "user-id",
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "some-id"
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order };
};

it("udpate the status of the order", async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("ack the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
