export interface IUser {
    _id: string;
    name: string;
    email: string;
    theme: boolean | undefined;
    password: string;
    resetPassword: boolean;
}