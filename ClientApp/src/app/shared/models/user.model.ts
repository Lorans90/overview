import { Role } from './role.model';

export interface User {
    id: number;
    username: string;
    displayName: string;
    title: string;
    isActive: boolean;
    lastLoggedIn?: string;
    tel: string;
    eMail: string;
    location: string;
    roles: Role[];
}