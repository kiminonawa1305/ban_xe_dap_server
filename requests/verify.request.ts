import {ObjectId} from "mongodb";

export type VerifyRequest = {
    _id: ObjectId,
    verifyCode: string
}