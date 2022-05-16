import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@zivhals-tickets/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import * as authHelper from "../../test/auth-helper";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
    const userOne = await authHelper.signIn();
    const res = await request(app)
        .post("/api/payments")
        .set("Cookie", userOne)
        .send({
            token: "asldkfj",
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it("returns a 401 when purchasing an order that does not beling to the user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    const userOne = await authHelper.signIn();
    const res = await request(app)
        .post("/api/payments")
        .set("Cookie", userOne)
        .send({
            token: "asldkfj",
            orderId: order.id
        })
        .expect(401);
});

it("return a 400 status when puchasing a cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    const userOne = await authHelper.signIn(userId);

    const res = await request(app)
        .post("/api/payments")
        .set("Cookie", userOne)
        .send({
            token: "asldkfj",
            orderId: order.id
        })
        .expect(400);
});

it("returns a 201 with valid input", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const price = Math.floor(Math.random() * 100000);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    const userOne = await authHelper.signIn(userId);

    const res = await request(app)
        .post("/api/payments")
        .set("Cookie", userOne)
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    const chargedOptions = (stripe.charges.create as jest.Mock).mock
        .calls[0][0];

    const chargeResult = await (stripe.charges.create as jest.Mock).mock
        .results[0].value;

    expect(chargedOptions.source).toEqual("tok_visa");
    expect(chargedOptions.amount).toEqual(order.price * 100);
    expect(chargedOptions.currency).toEqual("usd");

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: chargeResult.id
    });

    expect(payment).toBeDefined();
    expect(payment!.orderId).toEqual(order.id);
    expect(payment!.stripeId).toEqual(chargeResult.id);
});
