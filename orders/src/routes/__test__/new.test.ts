import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import * as authHelper from '../../test/auth-helper';

describe('test create new ticket', () => {
    it('returns an error if the ticket does not exist', async () => {
        const cookieHeader = await authHelper.signIn();
        const ticketId = new mongoose.Types.ObjectId();
    
        console.log("this is the ticket id:")
        console.log(ticketId)
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', cookieHeader)
            .send({ ticketId })
            .expect(404);
        
        console.log("ZIV3r !!")
        console.log(res.body)
    });

    it('returns an error if the ticket is already reserved', async () => {
        const cookieHeader = await authHelper.signIn();
        const ticket = Ticket.build({
            title: 'concert',
            price: 20,
        });
        await ticket.save();
        const order = Order.build({
            ticket,
            userId: 'laskdflkajsdf',
            status: OrderStatus.Created,
            expiresAt: new Date(),
        });
        await order.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', cookieHeader)
            .send({ ticketId: ticket.id })
            .expect(400);
        });

    it('reserves a ticket', async () => {
        const cookieHeader = await authHelper.signIn();
        const ticket = Ticket.build({
            title: 'concert',
            price: 20,
        });
        await ticket.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', cookieHeader)
            .send({ ticketId: ticket.id })
            .expect(201);
        });
});