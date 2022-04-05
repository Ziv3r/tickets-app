import express, { Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';;
import { TicketMongo } from '../models/ticket';
import { requireAuth, NotFoundError, NotAuthorizedError, validateExpressValidationRequest, BadRequestError  } from '@zivhals-tickets/common'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', [ 
    body('title')
        .notEmpty()
        .isString()
        .withMessage('title must be valid or not ...'),
    body('price')
        .notEmpty ()
        .isFloat({gt:0})
        .withMessage('you must supply a price that greater than 0')
    ], validateExpressValidationRequest, requireAuth, async (req:Request, res: Response, next: NextFunction) => {
    try{
        const ticket = await TicketMongo.findById(req.params.id);

        if(!ticket){
            throw new NotFoundError();
        }

        //compare userID from cookie to userID on ticker obj:
        if(ticket.userId !== req.currentUser?.id){
            throw new NotAuthorizedError();
        }

        if(ticket.orderId){
            throw new BadRequestError("Ticket is reserved")
        }
        
        ticket.set({
            title: req.body.title,
            price: req.body.price,
        })

        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket._id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        })    

        res.status(200).send(ticket);
    }
    catch(err){
        next(err)
    }
})


export { router as updateTicketRouter}