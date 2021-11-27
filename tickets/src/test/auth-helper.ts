import jwt from 'jsonwebtoken';

export const signIn = async () => {
    const payload = {
    id: 'id',
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