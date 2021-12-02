import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signIn = async () => {

    const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
    } 
    
   const token = jwt.sign(payload, process.env.JWT_KEY as string)

    const session = {
        jwt: token
    }

 // Turn that sesion into JSON 
 const sessionJSON = JSON.stringify(session);

 const base64 = Buffer.from (sessionJSON).toString('base64');

 return [`express:sess=${base64}`]
}