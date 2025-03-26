export interface User {
    id?: string;
    email?: string;
    name: string;
    googleId?: string;
    passwordHash?: string;
    createdAt?: Date;
    lastLoginAt?: Date;
}