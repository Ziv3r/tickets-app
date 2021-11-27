import request from 'supertest';
import { app } from '../../app'
import * as authHelper from '../../test/auth-helper';



describe('test create new ticket', () => {
    it('should return 404 if the ticket is not found', async () => {
        const response = 
            await request(app).
            post('/api/tickets/not-exist-it')
            .send()
            .expect(404);

    })

    it('returns the ticket if the ticket is found', async () => {
        
        let title = 'some-title';
        let price = 10;

        const cookieHeader = await authHelper.signIn();

        const newTicketResponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title,
            price
        })
        .expect(201);


         const ticketResponse = 
            await request(app)
            .get(`/api/tickets/${newTicketResponse.body.id}`)
            .send()
            .expect(200);

        expect(ticketResponse.body.title).toEqual(title)
        expect(ticketResponse.body.price).toEqual(price)
    })
})