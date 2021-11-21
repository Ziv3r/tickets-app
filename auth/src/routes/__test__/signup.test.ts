import request from 'supertest';
import { app } from '../../app';

describe('test sign-up route', () => {
    describe(' test only responsed', () => {
        describe('successful flow', () => {
            it('returns a 201 on successful signup', async () => {
                        return request(app)
                            .post('/api/users/signup')
                            .send({
                                email: 'test@test.com',
                                password: 'password'
                            })
                            .expect(201)
                    })

            it('returns a 201 on successful signup', async () => {
                const res = await request(app)
                    .post('/api/users/signup')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(201)

                expect(res.get('Set-Cookie')).toBeDefined();
            })
        })

         describe('un-successful flow', () => {
             it('returns a 400 on email not valid', async () => {
                return request(app)
                    .post('/api/users/signup')
                    .send({
                        email: 'test',
                        password: 'password'
                    })
                    .expect(400)
            })

                it('returns a 400 on email not valid', async () => {
                    return request(app)
                        .post('/api/users/signup')
                        .send({
                            email: 'test@test.com',
                            password: '123'
                        })
                        .expect(400)
                })


                it('returns a 400 with missing email and password', async () => {
                    return request(app)
                        .post('/api/users/signup')
                        .send({})
                        .expect(400)
                })
        })

   
     

    }) 

    describe(' test errors', () => {
         it('disallow duplicate emails' , async () => {
              await request(app)
                    .post('/api/users/signup')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(201)

              const res = await request(app)
                    .post('/api/users/signup')
                    .send({
                        email: 'test@test.com',
                        password: 'password'
                    })
                    .expect(400)
    })
    })
  
})
