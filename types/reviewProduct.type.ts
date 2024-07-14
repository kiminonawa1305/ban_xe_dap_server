import { ObjectId } from "mongodb"
import AddReviewRequest from "../../src/requests/addReview.request"

export type ReviewProductType = AddReviewRequest & {
    _id?: ObjectId,
    date: Date
}