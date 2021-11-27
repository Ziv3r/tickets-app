import mongoose from 'mongoose'; 
import { app } from './app';

const PORT = 10000; 

const start = async () => {
    if(!process.env.JWT_KEY){
            throw new Error('key for JWT is not configured!')
    }

     if(!process.env.MONGO_URI){
            throw new Error('mongo uri must be defined!')
    }


    try{
        await mongoose.connect(process.env.MONGO_URI, )
        console.log("CONNECTED TO MONGO")
    }catch(err){
        console.log(err);
    }

    app.listen(PORT, () => {
    console.log(`app is sss onddddn ${PORT}`)
    })
}

start(); 
