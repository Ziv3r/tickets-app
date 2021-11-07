import { CustomError } from './customer-error';

export class NotAuthorizedError extends CustomError {
    
    public statusCode: number = 401;
   
    constructor(){
        super('Not authorized')
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeError() {
        return [ 
            { message: 'Not authorized'}
        ]
    }
}

