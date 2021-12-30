import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser  } from '@ziv-tickets/common';

import { indexOrdersRouter } from './routes/index'
import { showOrdersRouter } from './routes/show';
import { newOrdersRouter } from './routes/new';
import {  deleteOrdersRouter } from './routes/delete'

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
)

app.use(currentUser)
app.use(indexOrdersRouter); 
app.use(showOrdersRouter); 
app.use(newOrdersRouter); 
app.use(deleteOrdersRouter); 

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler);

export {app}