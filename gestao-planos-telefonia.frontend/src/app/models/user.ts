export interface User {
    id?: string;
    email?: string;
    name: string;
    googleId?: string;
    passwordHash?: string;
    isGuest: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
}