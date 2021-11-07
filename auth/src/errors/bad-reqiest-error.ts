import { CustomError } from './customer-error';

export class BadRequestError extends CustomError {
    
    public message: string;
    public statusCode: number = 400;
   
    constructor( message : string){
        super(message)
        this.message = message ; 
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeError() {
        return [ 
            { message: this.message}
        ]
    }
}

