import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    theme?: boolean;
    email: string;
    resetPassword?: boolean;
    password?: string;
    disabled?: boolean;
}

export interface IUserDB extends Document {
    name: string;
    theme?: boolean;
    email: string;
    resetPassword?: boolean;
    password?: string;
    disabled?: boolean;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    theme: {
        type: Boolean,
        default: undefined,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    resetPassword: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
}, {
    collection: 'users',
    timestamps: true,
});

export const UserModel = mongoose.model<IUserDB>('User', UserSchema);