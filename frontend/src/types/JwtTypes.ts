import type { Role } from "./RolesTypes";

export type JwtPayload = {
    sub: string;
    name: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role;
}

export type JwtActionResponse = {
    isValid: boolean;
    message: string;
    token: string;
};