
export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",

}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    role: Role;
    profileImage?: string,
    isActive?: isActive;
    isBlocked?: boolean;
    blockedBy?: string;
    isVerified?: boolean;
    isDeleted?: boolean;
    auths: IAuthProvider[]
}