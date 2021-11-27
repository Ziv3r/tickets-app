import express, { Request, Response} from 'express';
import { TicketMongo } from '../models/ticket'
import { NotFoundError } from '@ziv-tickets/common'

const router = express.Router();

router.get('/api/tickets/:id', async (req:Request, res: Response) => {
    const ticket = await TicketMongo.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    }

    res.status(200).send(ticket);

})


export { router as showTicketRouter}