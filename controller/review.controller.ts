import {Express, Request} from "express";
import {addReview, deleteReview, getReviews, updateReview} from "../service/review.service";
import {ReviewProductType} from "../types/reviewProduct.type";
import {ObjectId} from "mongodb";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {log} from "../server";
import {AddReviewProductType} from "../requests/addReviewProduct.type";
import {GetReviewHasTotalResponse} from "../responses/getReviewHasTotal.response";
import {ReviewProductResponseType} from "../types/reviewProductResponse.type";

const TAG = "Review Controller"
export const runReviewController = (app: Express) => {
    app.post("/api/reviews/add", (
        req: Request<any, any, AddReviewProductType, any>,
        res) => {
        log(TAG, "add review", req.body)
        addReview(req.body).then((response) => {
            res.send(Builder<ResponseApi<ReviewProductResponseType>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            res.status(error.code).send(error.message)
        })
    });

    app.get("/api/reviews/:productId/:seeMore", (
        req: Request<{
            productId: string,
            seeMore: string
        }, any, any, any>,
        res) => {
        if (!req.params.productId || !req.params.seeMore) {
            res.status(400).send("Bad request")
            return;
        }
        log(TAG, "get reviews", req.body)
        const productId: ObjectId = ObjectId.createFromHexString(req.params.productId);
        const seeMore: number = parseInt(req.params.seeMore);
        getReviews(productId, seeMore)
            .then((response) => {
                res.send(Builder<ResponseApi<GetReviewHasTotalResponse>>().code(202).message("Thành công!").data({
                    reviews: response.reviews,
                    total: response.total
                }).build());
            })
            .catch((error) => {
                console.error("Failed to get reviews", error);
            })
    });

    app.put("/api/reviews/update", (
        req: Request<any, any, ReviewProductType, any>,
        res) => {
        log(TAG, "update review", req.body)
        updateReview(req.body).then((response) => {
            res.send(Builder<ResponseApi<ReviewProductResponseType>>().code(202).message("Thành công!").data(response).build());
        }).catch((error) => {
            res.status(error.code).send(error.message)
        })
    })

    app.delete("/api/reviews/delete/:userId/:reviewId", (
        req: Request<{ userId: string, reviewId: string }, any, any, any, any>,
        res) => {
        log(TAG, "delete review", req.body)
        let reviewId, userId: ObjectId;
        try {
            reviewId = ObjectId.createFromHexString(req.params.reviewId);
            userId = ObjectId.createFromHexString(req.params.userId);
        } catch (e) {
            res.status(400).send("Bad request")
            return;
        }
        deleteReview(userId, reviewId).then((response) => {
            res.send(Builder<ResponseApi<boolean>>().code(202).message("Thành công!").data(response).build());
        }).catch((error) => {
            console.error("Failed to get reviews", error);
        })
    });
}
