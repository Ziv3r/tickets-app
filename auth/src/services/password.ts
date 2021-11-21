import { scrypt, randomBytes} from 'crypto'
import { promisify} from 'util'; 

const scryptAsync = promisify(scrypt);

export class Password { 
    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer
        return `${buffer.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean>{
        //take the salt part from the stored password
        const [hashedPassword, salt] = storedPassword.split('.');
        const bufferForSupplied = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

        return hashedPassword === bufferForSupplied.toString('hex');
    }
}
