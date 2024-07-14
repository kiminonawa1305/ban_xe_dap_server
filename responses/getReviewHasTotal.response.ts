import {ReviewProductResponseType} from "../types/reviewProductResponse.type";

export type GetReviewHasTotalResponse = {
    total: number;
    reviews: ReviewProductResponseType[];
}
