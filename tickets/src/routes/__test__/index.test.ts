import request from 'supertest';
import { app } from '../../app'
import * as authHelper from '../../test/auth-helper';

describe('get all tickets', () => {
    it('returns the ticket if the ticket is found', async () => {
        const newTickets = [{ "title": 'some-title', price: 10}, { "title": 'some-title-1', price: 10}, { "title": 'some-title-2', price: 10}]
        const cookieHeader = await authHelper.signIn();

        const results = await Promise.all(newTickets.map(ticket => request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: ticket.title,
            price: ticket.price
        })))
        
        const response = await request(app)
                        .get('/api/tickets')
                        .send()
                        .expect(200);

        expect(response.body.length).toEqual(3);
    })
})