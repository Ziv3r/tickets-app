import express, { Request, Response, NextFunction} from 'express'
import { Order } from '../models/order'
import { NotAuthorizedError, NotFoundError, requireAuth } from '@ziv-tickets/common'

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req:Request, res: Response, next: NextFunction) => {
    try{
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('ticket');
            
        if(!order){
            throw new NotFoundError();
        }
        
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }

        res.send(order);
    }catch(error){
        next(error)
}
})

export { router as showOrdersRouter}