import {ResetPasswordRequest} from "./resetPassword.request";

export type ChangePasswordRequest =  ResetPasswordRequest & {
    currentPassword: string,
}