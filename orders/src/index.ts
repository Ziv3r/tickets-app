import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeneres/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeneres/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeneres/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeneres/payment-created-listener";

const PORT = 10000;

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("key for JWT is not configured!");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("mongo uri must be defined!");
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("nats client id must be defined!");
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("nats cluster id must be defined!");
    }

    if (!process.env.NATS_URI) {
        throw new Error("nats url must be defined!");
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URI
        );

        natsWrapper.client.on("close", () => {
            console.log("NATS conection closes");
            process.exit();
        });

        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED TO MONGO");
    } catch (err) {
        console.log(err);
    }

    app.listen(PORT, () => {
        console.log(`app is sss onddddn ${PORT}`);
    });
};

start();
