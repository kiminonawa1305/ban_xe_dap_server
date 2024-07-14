import {ReviewProductType} from "./reviewProduct.type";

export type ReviewProductResponseType  = ReviewProductType & {
    fullName: string,
    avatar: string
}
