import {UserHasPasswordType} from "../types/userHasPassword.type";

export type RegisterRequest = UserHasPasswordType & {
    confirmPassword: string,
}