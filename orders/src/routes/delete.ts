import express, { Request, Response, NextFunction} from 'express'
import { Order } from '../models/order'
import { NotAuthorizedError, NotFoundError, requireAuth, OrderStatus } from '@ziv-tickets/common'
import { isNamedExportBindings } from 'typescript';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req:Request, res: Response, next: NextFunction) => {
    try{
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        if(!order){
                throw new NotFoundError();
        }
        
        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();        
        }

        order.status = OrderStatus.Cancelled
        await order.save();
        
        console.log("Ziv3r check")
        console.log(order)
        res.status(204).send(order);

    }catch(error){
        next(error)
    }
})

export { router as deleteOrdersRouter}