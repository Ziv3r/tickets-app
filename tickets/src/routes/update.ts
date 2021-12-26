import express, { Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';;
import { TicketMongo } from '../models/ticket';
import { requireAuth, NotFoundError, NotAuthorizedError, validateExpressValidationRequest  } from '@ziv-tickets/common'
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

        const newTicket = await TicketMongo.findOneAndUpdate({_id: req.params.id}, req.body, { new: true});

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: newTicket!._id,
            title: newTicket!.title,
            price: newTicket!.price,
            userId: newTicket!.userId,
        })    

        res.status(200).send(newTicket);
    }
    catch(err){
        next(err)
    }
})


export { router as updateTicketRouter}