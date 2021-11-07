import express, {NextFunction, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import {BadRequestError} from '../errors/bad-reqiest-error';
import jwt from 'jsonwebtoken';
import  {User} from '../models/user'
import { validateExpressValidationRequest } from '../middlewares/express-validation-common';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max:20})
        .withMessage('Password must be vetween 4 and 20 chars')
], validateExpressValidationRequest , async (req: Request, res: Response, next: NextFunction) => {
    // check in wanted service if the user exist there
    try{    
        const {email, password} = req.body; 
        //check if the email is not exist already in the DB: 
        const isUserExist = await User.findOne({email})
        if(isUserExist){
            console.log("Email in use")
            throw new BadRequestError('User already exist');
        }

        //enter a new user in the DB 
        const newUser = User.build({email, password});
        await newUser.save();

        // generate json web
        
        const userJwt = jwt.sign({
            id: newUser.id,
            email: newUser.email
        }, process.env.JWT_KEY as string)

        //store the jwt on the seesion object
        req.session = {
            jwt:userJwt
        }

        res.status(201).send(newUser);
    } 
    catch(error){
         next(error) 
    }
})

export { router as signupRouter}