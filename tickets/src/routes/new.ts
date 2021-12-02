import express, { Request, Response} from 'express';
import { requireAuth, validateExpressValidationRequest } from '@ziv-tickets/common'
import { body } from 'express-validator';
import { TicketMongo } from '../models/ticket'

const router = express.Router();

router.post('/api/tickets', requireAuth, [ 
    body('title')
        .notEmpty()
        .isString()
        .withMessage('title must be valid'),
    body('price')
        .notEmpty ()
        .isFloat({gt:0})
        .withMessage('you must supply a price that greater than 0')
], validateExpressValidationRequest,async (req: Request, res: Response) => {
    const { title, price} = req.body;
    const ticket = TicketMongo.build({
        title,
        price,
        userId: req.currentUser!.id
  });

  await ticket.save()

    res.status(201).send(ticket)
});

export { router  as createTicketRouter} 