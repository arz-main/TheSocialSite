import { Role } from "./RolesTypes";

export type JwtPayload = {
    sub: string;
    name: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role;
}