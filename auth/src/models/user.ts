import mongoose from 'mongoose';

// An interface that describes the properits for the User 
interface UserAttrs {
    email: string,
    password: string
}

interface UserModel extends mongoose.Model<any> {
    build( attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document<any> {
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.build = (user: UserAttrs): mongoose.Document => {
    return new User(user)
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema) ;

const user = User.build({
    email: "test@test.com",
    password: "pass"
})




export { User }; 