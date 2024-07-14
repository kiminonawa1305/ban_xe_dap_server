import {Express, Request} from "express";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {
    getAll,
    getAttrForFilter,
    getProductById,
    getProductsBestSale,
    getProductsByCategory,
    getProductsByFilter
} from "../service/product.service";
import {ProductHasTotalType} from "../types/productsHasTotal.type";
import FilterAttributeType from "../types/filterAttribute.type";
import {ProductType} from "../types/product.type";
import {CustomError} from "../errors/custom.error.type";
import {log} from "../server";
import {ObjectId} from "mongodb";
import {getReviews} from "../service/review.service";

const TAG = "Product Controller"

export const runProductController = (app: Express) => {
    const qs = require('qs')
    app.get("/api/products/all", (req, res) => {
        log(TAG, "get all", req.body)
        getAll().then((response) => {
            res.send(Builder<ResponseApi<ProductType[]>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            console.error("Failed to get all products", error);
        })
    });

    app.get("/api/products/:category/page=:page", (req, res) => {
        const category = parseInt(req.params.category as string);
        const seeMore = parseInt(req.params.page as string);
        log(TAG, "get products by category", req.body)
        getProductsByCategory(category, seeMore).then((response) => {
            res.send(Builder<ResponseApi<ProductHasTotalType>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            console.error("Failed to get products by category", error);
        })
    });

    app.get("/api/products/best-sale/:bestSale", (req, res) => {
        const bestSale: boolean = req.params.bestSale as string == "true";
        log(TAG, "get products best sale", req.body)
        getProductsBestSale(bestSale).then((response) => {
            res.send(Builder<ResponseApi<ProductType[]>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            console.error("don't load product best sale", error);
        })
    });

    app.get("/api/products/:category/filter-attribute", (req, res) => {
        const category = parseInt(req.params.category as string);
        log(TAG, "get attr for filter", req.body)
        getAttrForFilter(category).then((response) => {
            res.send(Builder<ResponseApi<FilterAttributeType>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            console.error("Failed to get filter attributes", error);
        })
    })

    app.get("/api/products/:category/page=:page/filter", (req, res) => {
        log(TAG, "get products by category", req.body)
        const query = qs.parse(req.query);

        const category: number = parseInt(req.params.category as string);
        const seeMore: number = parseInt(req.params.page as string);
        const brands: string[] = query.brands as string[];
        const wheelSizes: string[] = query.wheelSizes as string[];
        const materials: string[] = query.materials as string[];
        const targetUsings: string[] = query.targetUsings as string[];
        const prices: string = req.query.prices as string
        const newProduct: boolean = query.newProduct as string == "true";
        const bestSale: boolean = query.bestSale as string == "true";
        const sort: string = query.sort as string;
        getProductsByFilter(category, seeMore, brands, wheelSizes, materials, targetUsings, prices, newProduct, bestSale, sort).then((response) => {
            res.send(Builder<ResponseApi<ProductHasTotalType>>()
                .code(202)
                .message("Thành công!")
                .data(response)
                .build());
        }).catch((error) => {
            console.error("Failed to get products by mix filter", error);
        })
    })

    app.get("/api/product-detail/:id", (req: Request<{
                                            id: string
                                        }, any, any, {
                                            user: string
                                        }, any>,
                                        res) => {
        log(TAG, "get product by id", req.body)
        const promiseProduct = getProductById(req.params.id, req.query.user)
        const promiseGetReviews = getReviews(ObjectId.createFromHexString(req.params.id), 1)

        Promise.all([promiseProduct, promiseGetReviews]).then(([product, getReviews]) => {
            if (!product) {
                res.status(404).send("Product not found")
                return;
            }
            product.reviews = getReviews.reviews;
            res.send(Builder<ResponseApi<ProductType>>()
                .code(202)
                .message("Thành công!")
                .data(product)
                .build());
        }).catch(error => {
            res.status(error.code).send(error.message);
        });
    });
}



