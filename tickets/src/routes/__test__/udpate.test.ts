import request from 'supertest';
import { app } from '../../app'
import * as authHelper from '../../test/auth-helper';

describe('update ticket', () => {
    it('should return 404 if ticket is not exist', async () => {
        const cookieHeader = await authHelper.signIn();
        await request(app)
        .put('/api/tickets/not-exist-id')
        .set('Cookie', cookieHeader)
        .send({
            title: 'new-title',
            price: 20
        })
        .expect(404)
    })

    it('should return 401 if the user is not authnticated', async () => {
        await request(app)
        .put('/api/tickets/not-exist-id')
        .send({
            title: 'new-title',
            price: 20
        })
        .expect(401)
    })

    it('should return 401 if the user is not owned the ticket', async () => {
        let cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: 'some-title',
            price: 10
        })
        .expect(201);

        cookieHeader = await authHelper.signIn(); // generat new cookie for pretend diffrent user
         await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookieHeader)
        .send({
            title: 'new-title',
            price: 20
        })
        .expect(401)
    })

     it('should return 400 if the user provied an invalid title OR price', async () => {
         let cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: 'some-title',
            price: 10
        })
        .expect(201);


        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookieHeader)
            .send({
                title: '',
                price: 20
            })
            .expect(400)

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookieHeader)
            .send({
                title: 'valid',
                price: -10
            })
            .expect(400)

    })


      it('should return 200 if ticket update is updated successflly', async () => {
          let cookieHeader = await authHelper.signIn(); // generat new cookie for pretend diffrent user

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookieHeader)
            .send({
                title: 'some-title',
                price: 10
            })
            .expect(201);

        await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie', cookieHeader)
            .send({
                title: 'new-title',
                price: 20
            })
            .expect(200)

        const ticketResponse = 
        await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);


        expect(ticketResponse.body.title).toEqual('new-title')
        expect(ticketResponse.body.price).toEqual(20)
     })
})