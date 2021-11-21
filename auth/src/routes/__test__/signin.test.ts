import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

describe('test sign-in route', () => {
    it('try to sign in with un-sign user should return 400 with Invalid credentials error', async() => {
          const res = await request(app)
                    .post('/api/users/signin')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(400)
                    
                    expect(res.body.erros[0].message).toBe('User is not exist !') ;
    })

      it('try to sign in with un-sign user should return 400 with Invalid credentials error', async() => {
          const res = await request(app)
                    .post('/api/users/signup')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(201)
                    
                 await request(app)
                    .post('/api/users/signin')
                    .send({
                        email: 'test@test.com',
                        password: 'wrong-password'
                    })
                    .expect(400)
    })

    it('responds with a cookie when given valid credentials ', async() => {
          await request(app)
                        .post('/api/users/signup')
                        .send({
                            email: 'test@test.com',
                            password: 'password'
                        })
                        .expect(201)
                    
          const res = await request(app)
                    .post('/api/users/signin')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(200)

                    expect(res.get('Set-Cookie')).toBeDefined();
    })


})