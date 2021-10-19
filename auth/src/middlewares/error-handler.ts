import {Request, Response, NextFunction} from 'express';
import { CustomError } from '../errors/customer-error';

interface ErrorToClient {
    errors: {
        message: string,
        field?: string,
    }[]
}

export const errorHandler = (err: Error , req: Request, res: Response, next: NextFunction ) => {

    if(err instanceof CustomError ){ 
       return res.status(err.statusCode).send( {erros: err.serializeError()})
    }

    res.status(400).send(
        {
            errors: {
                message: "generic error"
            }
        }
    )
}