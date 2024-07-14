import {ObjectId} from "mongodb";

export type AddReviewProductType = {
    productId: ObjectId,
    userId: ObjectId,
    comment: string,
    rating: number
}
