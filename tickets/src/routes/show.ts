import express, { Request, Response, NextFunction} from 'express';
import { TicketMongo } from '../models/ticket'
import { NotFoundError } from '@zivhals-tickets/common'

const router = express.Router();

router.get('/api/tickets/:id', async (req:Request, res: Response, next: NextFunction) => {
    try{
        console.log("DEBUG GET ALL TICKETS")
        const ticket = await TicketMongo.findById(req.params.id);

        if(!ticket){
            throw new NotFoundError();
        }

        res.status(200).send(ticket);
    }catch(err){
        next(err)
    }
})


export { router as showTicketRouter}