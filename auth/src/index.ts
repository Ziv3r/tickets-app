import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose'; 

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error'

const PORT = 10000; 
const app = express();

app.use(json());
app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler);

const start = async () => {
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', )
    }catch(err){
        console.log(err);
    }

    app.listen(PORT, () => {
    console.log(`app is sss onddddn ${PORT}`)
    })
}

start(); 
