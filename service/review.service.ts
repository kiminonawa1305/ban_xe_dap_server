import {connection} from "../database.connect";
import {ReviewProductType} from "../types/reviewProduct.type";
import {Collection, ObjectId} from "mongodb";
import {checkUserId} from "./user.service";
import {productNotFound, reviewExists, reviewIdNotExists, userNotFound} from "../errors/error.enum";
import {checkProductId} from "./product.service";
import {ReviewProductResponseType} from "../types/reviewProductResponse.type";
import {AddReviewProductType} from "../requests/addReviewProduct.type";
import {ProductType} from "../types/product.type";

const collection = 'reviews';
const reviewProductRepository: Collection<ReviewProductType> = connection.collection<ReviewProductType>(collection);

async function addReview(request: AddReviewProductType): Promise<ReviewProductResponseType> {
    request.userId = ObjectId.createFromHexString(request.userId.toString())
    request.productId = ObjectId.createFromHexString(request.productId.toString())
    const promiseUser = checkUserId(request.userId)
    const promiseProduct = checkProductId(request.productId);
    const promiseReview = reviewProductRepository.countDocuments({userId: request.userId, productId: request.productId})

    return Promise.all([promiseUser, promiseProduct, promiseReview]).then(async ([user, product, reviews]) => {
        if (!user) throw userNotFound
        if (!product) throw productNotFound
        if (reviews) throw reviewExists
        const review: ReviewProductType = {
            ...request,
            userId: ObjectId.createFromHexString(request.userId.toString()),
            productId: ObjectId.createFromHexString(request.productId.toString()),
            date: new Date()
        }
        const response = await reviewProductRepository.insertOne(review);
        return {
            ...review,
            _id: response.insertedId,
            fullName: user.fullName ?? "",
            avatar: user.urlAvatar ?? "",
        } as ReviewProductResponseType;
    }).catch((error) => {
        throw error
    });
}

async function getReviews(productId: ObjectId, seeMore: number): Promise<{
    total: number,
    reviews: ReviewProductResponseType[]
}> {
    const total = await reviewProductRepository.countDocuments({productId: productId});
    if (!total) return {total: 0, reviews: []}
    let limit = Math.min(5 * seeMore, total)
    const reviews = await reviewProductRepository.aggregate<ReviewProductResponseType>([
        {
            $match: {productId: productId}
        },
        {
            $sort: {date: -1}
        },
        {
            $skip: 5 * (seeMore - 1)
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                _id: 1,
                fullName: '$user.fullName',
                userId: '$user._id',
                avatar: '$user.avatar',
                rating: 1,
                comment: 1,
                date: 1
            }
        }
    ]).toArray()
    return {total, reviews};
}

async function updateReview(review: ReviewProductType): Promise<ReviewProductResponseType> {
    if (!review._id) throw reviewIdNotExists
    review.date = new Date();
    const user = await checkUserId(ObjectId.createFromHexString(review.userId.toString()))
    if (!user) throw userNotFound
    return reviewProductRepository.findOneAndUpdate(
        {
            _id: ObjectId.createFromHexString(review._id.toString()),
            userId: ObjectId.createFromHexString(review.userId.toString())
        },
        {
            $set: {
                date: review.date,
                comment: review.comment,
                rating: review.rating
            }
        },
    ).then((response): ReviewProductResponseType => {
        return {
            ...review,
            _id: response?._id,
            fullName: "",
            avatar: ""
        }
    })
}

async function deleteReview(userId: ObjectId, reviewId: ObjectId): Promise<boolean> {
    const filter = {_id: reviewId, userId: userId};

    return reviewProductRepository.deleteOne(
        filter,
    ).then((response): boolean => {
        return response !== null
    }).catch(() => {
        return false
    })
}

export {addReview, getReviews, updateReview, deleteReview}
