import {ObjectId} from "mongodb";

export type UpdateReviewRequest = {
    _id: ObjectId,
    rating: number,
    comment: string,
}
