import {ObjectId} from "mongodb";

export enum PayMethodEnum {
    CASH = "Tiền mặt",
    QR = "QR",
    VISA = "VISA",
    MASTER = "MASTER"
}

export type InfoPayType = {
    _id: ObjectId,
    fullName: string,
    phoneNumber: string,
    email: string,
    fullAddress: string,
    note: string,
    province: string,
    district: string,
    ward: string,
    payMethod: PayMethodEnum
}