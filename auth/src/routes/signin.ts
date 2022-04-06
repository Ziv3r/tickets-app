import express, {NextFunction, Request, Response} from 'express';
import { Password } from '../services/password';
import { body } from 'express-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateExpressValidationRequest } from '@zivhals-tickets/common';

const router = express.Router();

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('you must supply a password')
], validateExpressValidationRequest, async (req: Request, res: Response, next: NextFunction) => {
    try{
    // get the email and the password 
    const {email, password } = req.body;
    // get the user from the mongo
    const user = await User.findOne({email});
    if(!user){
        throw new BadRequestError("User is not exist !")
    }

    // user is exist --> now check it with the compare function in the PASSWWORD class 
    // static async compare(storedPassword: string, suppliedPassword: string){
    const isPasswordCorrect  = await Password.compare(user.password, password);
    if(!isPasswordCorrect){
        throw new BadRequestError("password is wrong !")
    }

    // if it is ok send ok 
    const userJwt = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_KEY as string)

        //store the jwt on the seesion object
        req.session = {
            jwt:userJwt
        }



    //if it is not say that something is not good ( email / password)
    res.status(200).send(user)
    }
    catch(error){
        next(error)
    }
})

export { router as signinRouter}
