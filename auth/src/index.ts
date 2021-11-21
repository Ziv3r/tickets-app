import mongoose from 'mongoose'; 
import { app } from './app';

const PORT = 10000; 

const start = async () => {
    if(!process.env.JWT_KEY){
            throw new Error('key for JWT is not configured!')
    }

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
