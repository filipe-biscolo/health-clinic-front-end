export interface Login {
    email: string;
    password: string;
}

export interface LoginToken {
    token: string;
}

export interface TokenJWT {
    clinic_id: string;
    professional_id: string;
    permissions: string;
    admin: boolean;
    exp: number;
    iat: number;
    id: string;

    name?: string;
    email?: string;
    type?: string;
}
    