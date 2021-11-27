import request from 'supertest';
import { app } from '../../app'
import * as authHelper from '../../test/auth-helper';

describe('test create new ticket', () => {
    it('helath check /api/tickets', async () => {
        const response = 
            await request(app).
            post('/api/tickets')
            .send({});

        expect (response.status).not.toEqual(404);

    })

    it('when the user is not signed in should throw an error', async () => {
        const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
    })

    it('when the user is signed in should  not return 401', async () => {
        const cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({})

        expect (response.status).not.toEqual(401);
    })

    it('when invalid title is provided should returns an error ', async () => {
        const cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    })

    it('when invalid type is provided should throw an error', async () => {
         const cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: 'some-title', 
            price: -10
        })
        .expect(400);
    })

       it('when invalid type is provided should throw an error', async () => {
         const cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: 'some-title',
        })
        .expect(400);
    })


    it('create new ticket', async () => {
        // todo: add in a check to make sure a ticket was saved.
        const cookieHeader = await authHelper.signIn();

        const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieHeader)
        .send({
            title: 'some-title',
            price: 10
        })
        .expect(201);
    })
})