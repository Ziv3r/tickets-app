import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import * as authHelper from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose';

describe('delete order', () => {

    const buildTicket = async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'concert',
            price: 20
        }) 

        await ticket.save()
        return ticket;
        
    }
    it('fetch orders for an particular user', async () => {
        // Create 3 tickets
        const ticketOne = await buildTicket();

        const userOne = await authHelper.signIn();

        // Create 1 order as User # 1
        const { body: createOrderResponseBody} = await request(app)
                                                        .post('/api/orders')
                                                        .set('Cookie', userOne)
                                                         .send({ ticketId: ticketOne.id })
                                                        .expect(201);

        //fetch the orders for user #2
        await request(app)
                .delete(`/api/orders/${createOrderResponseBody.id}`)
                .set('Cookie', userOne)
                .expect(204)

        const updatedOrder = await Order.findById(createOrderResponseBody.id)
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    })

     it('reserves a ticket', async () => {
         const ticketOne = await buildTicket();

        const userOne = await authHelper.signIn();

        // Create 1 order as User # 1
        const { body: createOrderResponseBody} = await request(app)
                                                        .post('/api/orders')
                                                        .set('Cookie', userOne)
                                                         .send({ ticketId: ticketOne.id })
                                                        .expect(201);

        //fetch the orders for user #2
        await request(app)
                .delete(`/api/orders/${createOrderResponseBody.id}`)
                .set('Cookie', userOne)
                .expect(204)

    
        expect(natsWrapper.client.publish).toHaveBeenCalled();
        
    });
})