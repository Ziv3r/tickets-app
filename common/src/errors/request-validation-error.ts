import { ValidationError } from 'express-validator';
import { CustomError } from './customer-error';

export class RequestValidationError extends CustomError {
    
    public errors: ValidationError[];
    public statusCode: number = 400;

    constructor( errors: ValidationError[]){
        super('Invalid request paramaters')
        this.errors = errors ; 
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

     serializeError() {
        const formattedErrors = this.errors.map(error => {
            return {message: error.msg, field:error.param}
        })

        return formattedErrors;
    }
}

