import {ObjectId} from "mongodb";

export type BillItemType = {
    _id: ObjectId,
    model: string,
    quantity: number,
    price: number
}