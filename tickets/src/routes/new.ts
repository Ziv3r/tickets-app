import express, { Request, Response} from 'express';
import { requireAuth, validateExpressValidationRequest } from '@ziv-tickets/common'
import { body } from 'express-validator';


const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title')
        .notEmpty()
        .isString()
        .withMessage('title must be valid'),
    body('price')
        .notEmpty ()
        .isFloat({gt:0})
        .withMessage('you must supply a price')
], validateExpressValidationRequest, (req: Request, res: Response) => {
    res.status(201).send("HELLO")
});

export { router  as createTicketRouter} 