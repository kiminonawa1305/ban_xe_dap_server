import {InfoPayType} from "../types/infoPay.type";
import {BillItemType} from "../types/billItem.type";

export type PayRequest = {
    infoPay: InfoPayType,
    products: BillItemType[],
    date: Date
}