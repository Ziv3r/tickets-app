import { CustomError } from './customer-error';

export class DatabaseConnecitonError extends CustomError {
    
    public reason: string;
    public statusCode: number = 500;
   
    constructor( reason : string){
        super('Error connectiong to db')
        this.reason = reason ; 
        Object.setPrototypeOf(this, DatabaseConnecitonError.prototype)
    }

    serializeError() {
        return [ 
            { message: this.reason}
        ]
    }
}

