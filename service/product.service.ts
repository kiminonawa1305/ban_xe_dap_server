import {connection} from "../database.connect";
import {ProductType} from "../types/product.type";
import {ObjectId, Sort, WithId} from "mongodb";
import {productNotFound} from "../errors/error.enum";
import {BillItemType} from "../types/billItem.type";
import BillService from "./bill.service";

const collection = 'products';
const productRepository = connection.collection<ProductType>(collection);

async function getAll() {
    return productRepository
        .find<ProductType>({"model.quantity": {$gte: 1}})
        .toArray()
}

async function getProductsByCategory(category: number, count: number) {
    const total = await productRepository.countDocuments({category: category, "model.quantity": {$gte: 1}})
    let y = 8 * count
    if (y >= total) y = total
    const products = await productRepository.find<ProductType>({
        category: category,
        "model.quantity": {$gte: 1}
    }).limit(y).toArray()

    return {
        total: total,
        products: products
    }
}

async function getProductsByFilter(
    category: number,
    count: number,
    brands?: string[],
    wheelSizes?: string[],
    materials?: string[],
    targetUsings?: string[],
    price?: string,
    newProduct?: boolean,
    bestSale?: boolean,
    sort?: string,) {


    const query = getQuery(category, brands, wheelSizes, materials, targetUsings, price, newProduct, bestSale)
    const sortQuery: Sort = ((sort === undefined ? 'asc' : sort) === 'asc' ? {"price": 1} : {"price": -1})
    const total = await productRepository.countDocuments(query)
    let y = 8 * count
    if (y >= total) y = total
    const products = await productRepository.find<ProductType>(query).sort(sortQuery).limit(y).toArray()

    return {
        total: total,
        products: products
    }
}

function getQuery(
    category: number,
    brands?: string[],
    wheelSizes?: string[],
    materials?: string[],
    targetUsings?: string[],
    price?: string,
    newProduct?: boolean,
    bestSale?: boolean,
): {} {

    let query: {} = {category: category, "model.quantity": {$gte: 1}}
    let [minPrice, maxPrice] = (price === undefined ? price = '0-0' : price as string).split('-').map(Number)

    if (brands !== undefined) {
        const brandsArr = customQuery(brands)
        query = {...query, 'base_description.brand': {$in: brandsArr}}
    }
    if (wheelSizes !== undefined) {
        const wheelSizesArr = customQuery(wheelSizes)
        query = {...query, 'specifications.wheelSize': {$in: wheelSizesArr}}
    }
    if (materials !== undefined) {
        const materialsArr = customQuery(materials)
        query = {...query, 'base_description.material': {$in: materialsArr}}
    }
    if (targetUsings !== undefined) {
        const targetUsingsArr = customQuery(targetUsings)
        query = {...query, 'specifications.targetUsing': {$in: targetUsingsArr}}
    }
    if (maxPrice !== 0) {
        query = {...query, price: {$gte: minPrice, $lte: maxPrice}}
    }
    if (newProduct) {
        query = {...query, new: newProduct}
    }
    if (bestSale) {
        query = {...query, sale: bestSale}
    }

    return query
}

async function getProductsBestSale(bestSale: boolean) {
    if (bestSale) {
        return productRepository
            .find({sale: true, "model.quantity": {$gte: 1}}).sort({"discount": -1}).limit(8)
            .toArray()

    }
    return productRepository
        .find({new: true, "model.quantity": {$gte: 1}}).limit(8)
        .toArray()
}

async function getAttrForFilter(category: number) {
    const result = Promise.all(
        [productRepository.distinct('base_description.brand', {category: category, "model.quantity": {$gte: 1}}),
            productRepository.distinct('specifications.wheelSize', {category: category, "model.quantity": {$gte: 1}}),
            productRepository.distinct('base_description.material', {category: category, "model.quantity": {$gte: 1}}),
            productRepository.distinct('specifications.targetUsing', {category: category, "model.quantity": {$gte: 1}}),
            productRepository.find({
                category: category,
                "model.quantity": {$gte: 1}
            }).sort({price: 1}).limit(1).toArray(),
            productRepository.find({
                category: category,
                "model.quantity": {$gte: 1}
            }).sort({price: -1}).limit(1).toArray()])
    return result.then((values) => {
        return {
            brands: values[0],
            wheelSizes: values[1],
            materials: values[2],
            targetUsings: values[3],
            prices: {min: values[4][0].price, max: values[5][0].price}
        }
    })
}

async function getProductById(productId: string, userId: string) {
    let hasBuy = false;
    if (userId) hasBuy = await BillService.newInstance().checkBuy(productId, userId)
    return productRepository
        .findOne({_id: ObjectId.createFromHexString(productId), "model.quantity": {$gte: 1}})
        .then((product): ProductType => {
            if (!product) throw productNotFound;
            product.hasBuy = hasBuy
            return product;
        }).catch(() => {
            throw productNotFound;
        })
}

function payProducts(billItemTypes: BillItemType[]) {
    const array: BillItemType[] = []
    billItemTypes.forEach(async (billItemType: BillItemType) => {
        billItemType._id = ObjectId.createFromHexString(billItemType._id.toString())
        return await productRepository
            .findOneAndUpdate(
                {
                    "_id": billItemType._id,
                    "model.color": billItemType.model,
                    "model.quantity": {$gte: billItemType.quantity}
                },
                {$inc: {"model.$.quantity": -billItemType.quantity}}
            )
            .then((response) => {
                if (!response) return false;
                array.push(billItemType)
                billItemType.price = response.discount ? (100 - response.discount) * response.price : response.price
            })
            .catch((error) => {
                rollBackProduct(array)
                return false;
            });
    });
    return true;
}

async function rollBackProduct(billItemTypes: BillItemType[]) {
    billItemTypes.map((billItemType: BillItemType) => {
        productRepository
            .updateMany(
                {
                    "_id": billItemType._id,
                    "model.color": billItemType.model,
                },
                {$inc: {"model.$.quantity": billItemType.quantity}}
            )
    })
}

async function checkProductId(id: ObjectId): Promise<ProductType | null> {
    return await productRepository.findOne({_id: id}).then((response) => {
        return response;
    })
}


function customQuery(arr: string[]) {
    if (arr.length === 0) return []

    return arr.map((item) => {
        return item.replace('-', ' ')
    })
}

export {
    getAll,
    getProductsByCategory,
    getProductsBestSale,
    getAttrForFilter,
    getProductsByFilter,
    getProductById,
    payProducts,
    checkProductId
};
