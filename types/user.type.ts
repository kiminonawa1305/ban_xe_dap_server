import {ObjectId} from "mongodb";

export type User = {
    _id?: ObjectId
    fullName?: string,
    urlAvatar?: string,
    username?: string,
    phone?: string,
    birthday?: Date,
    gender?: string,
    email?: string,
}