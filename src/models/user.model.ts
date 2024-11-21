import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.pre<UserDocument>("save", async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
})

userSchema.methods.comparePassword = async function (candidatePassword: string):Promise<boolean> {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch( () => false)
}

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;