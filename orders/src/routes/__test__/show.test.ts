import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket'
import { Order } from '../../models/order'
import * as authHelper from '../../test/auth-helper';


describe('show order for user', () => {

    const buildTicket = async () => {
        const ticket = Ticket.build({
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
        const { body: fetchedOrder} = await request(app)
                                .get (`/api/orders/${createOrderResponseBody.id}`)
                                .set('Cookie', userOne)
                                .expect(200)
        
        expect(fetchedOrder.id).toEqual(createOrderResponseBody.id)
        // make sure we only got the orders for usr #2
    })

      it('returns an error if one user tries to fetch another user order', async () => {
        // Create 3 tickets
        const ticketOne = await buildTicket();

        const userOne = await authHelper.signIn();
        const userTwo = await authHelper.signIn();

        // Create 1 order as User # 1
        const { body: createOrderResponseBody} = await request(app)
                                                        .post('/api/orders')
                                                        .set('Cookie', userOne)
                                                        .send({ ticketId: ticketOne.id })
                                                        .expect(201);

        //fetch the orders for user #2
        const { body: fetchedOrder} = await request(app)
                                .get (`/api/orders/${createOrderResponseBody.id}`)
                                .set('Cookie', userTwo)
                                .expect(401)
        
    })
})