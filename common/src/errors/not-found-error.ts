import { CustomError } from './customer-error' ;

export class NotFoundError extends CustomError{
    statusCode = 404;
    error =  'Not found';

    constructor(){
        super('Not found');
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeError(): { message: string; field?: string | undefined; }[] {
        return [{
            message: this.error
        }
        ]
    }

}