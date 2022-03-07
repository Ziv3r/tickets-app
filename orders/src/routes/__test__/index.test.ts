import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket'
import { Order } from '../../models/order'
import * as authHelper from '../../test/auth-helper';
import mongoose from 'mongoose';


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
        const ticketTwo = await buildTicket();
        const ticketThree = await buildTicket();

        const userOne = await authHelper.signIn();
        const userTwo = await authHelper.signIn();

        // Create 1 order as User # 1
        await request(app)
            .post('/api/orders')
            .set('Cookie', userOne)
            .send({ ticketId: ticketOne.id })
            .expect(201);

        // Create 2 order as User # 2
        const { body: orderOne } = await request(app)
            .post('/api/orders')
            .set('Cookie', userTwo)
            .send({ ticketId: ticketTwo.id })
            .expect(201);

        const { body: orderTwo } = await request(app)
            .post('/api/orders')
            .set('Cookie', userTwo)
            .send({ ticketId: ticketThree.id })
            .expect(201);

        //fetch the orders for user #2

        const resp = await request(app)
                                .get ('/api/orders')
                                .set('Cookie', userTwo)
                                .expect(200)
        
        expect(resp.body.length).toEqual(2);
        expect(resp.body[0].id).toEqual(orderOne.id);
        expect(resp.body[1].id).toEqual(orderTwo.id);
        // make sure we only got the orders for usr #2
    })