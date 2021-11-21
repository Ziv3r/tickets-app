import request from 'supertest';
import { app } from '../../app';
import {signIn} from '../../test/auth-helper';

describe('test sign-up route', () => {
    it('responds with details about the current user', async () => {
        const cookie = await signIn()
        
        const resp = await request(app)
            .get('/api/users/currentuser')
            .set('Cookie', cookie)
            .send()
            .expect(200);

      expect(resp.body.currentUser.email).toEqual('test@test.com')

    })

    it('responds with null if the user is not authnitcated', async () => {
        const resp = await request(app)
            .get('/api/users/currentuser')
            .send()
            .expect(200);

      expect(resp.body.currentUser).toEqual(null)

    })
})