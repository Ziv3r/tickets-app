import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;
jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
    "sk_test_51Kzm5wBFl42k8ivUezMFrTxUeGSVwr8U946cCI6DAcNby7NstdFZCBygYNomXReVmaxjo4jsJ3bPqwBKdF9LiFae00ybSQEWvt";

beforeAll(async () => {
    jest.setTimeout(50000);
    process.env.JWT_KEY = "ziv3r";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});
