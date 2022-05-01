import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, ExpirationCompleteEvent } from "@zivhals-tickets/common";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    });
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "test-id",
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, ticket, data, msg };
};

it("update the order status to cancelled", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    // call the onMessafe function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    // call the onMessafe function with the data object + message object
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // write assertions to make sure a ticket was created
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
    const { listener, order, ticket, data, msg } = await setup();

    // call the onMessafe function with the data object + message object
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
