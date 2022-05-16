import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateExpressValidationRequest,
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus
} from "@zivhals-tickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
    validateExpressValidationRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("hi payments");
            const { token, orderId } = req.body;
            console.log(orderId);

            const order = await Order.findById(orderId);

            if (!order) {
                throw new NotFoundError();
            }
            if (order.userId !== req.currentUser!.id) {
                throw new NotAuthorizedError();
            }
            if (order.status === OrderStatus.Cancelled) {
                throw new BadRequestError("Cannot pay for an cancelled order");
            }

            const charge = await stripe.charges.create({
                currency: "usd",
                amount: order.price * 100,
                source: token
            });

            console.log("ASDASDASDASDASDASDASDASD", charge);

            const payment = Payment.build({
                orderId,
                stripeId: charge.id
            });

            await payment.save();

            res.status(201).send({ success: true });
        } catch (error) {
            next(error);
        }
    }
);

export { router as createChargeRouter };
