import express, {NextFunction, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnecitonError } from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max:20})
        .withMessage('Password must be vetween 4 and 20 chars')
],async (req: Request, res: Response, next: NextFunction) => {
    // check in wanted service if the user exist there
    try{    
        console.log("in happy flow")
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            throw(new RequestValidationError(errors.array()))
        }
        
        const {email, password} = req.body; 
        console.log("Creating a User")
        throw new DatabaseConnecitonError("Error By My TEST ! ")
        res.send({status:"succeasdasdasss!!!!"})
    }
    catch(error){
         next(error) 
    }
})

export { router as signupRouter}