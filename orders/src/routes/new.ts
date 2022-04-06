import express, { Request, Response, NextFunction} from 'express'
import { NotFoundError, requireAuth, validateExpressValidationRequest, BadRequestError, OrderStatus} from '@zivhals-tickets/common'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper} from '../nats-wrapper'

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth,
[
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId must be provided')
],validateExpressValidationRequest, async (req:Request, res: Response, next: NextFunction) => {
    try{
        const { ticketId } = req.body;
            //find the ticket the user is trying to order
            const ticket = await Ticket.findById(ticketId);
            if(!ticket){
                throw new NotFoundError();
            }
            
            const isTicketAlreadyReserved = await ticket.isReserved()
            if(isTicketAlreadyReserved){
                throw new BadRequestError('Ticket is already reserved');
            }

            // build the expiration time 
            const expiration = new Date()
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

            const order = Order.build({
                userId: req.currentUser!.id,
                status: OrderStatus.Created,
                expiresAt: expiration,
                ticket,
            })

            await order.save();

            //publish event
            new OrderCreatedPublisher(natsWrapper.client).publish({
                id: order.id,
                version: order.version,
                status: OrderStatus.Created,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket. price
                }
            })
            
            res.status(201).send(order);
    }catch(error){
        next(error)
    }
})

export { router as newOrdersRouter}