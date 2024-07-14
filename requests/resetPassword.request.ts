import {ObjectId} from "mongodb";

export type ResetPasswordRequest = {
    _id: ObjectId,
    newPassword: string,
    confirmPassword: string
}