import {Express, Request} from "express";
import {PayRequest} from "../requests/pay.request";
import BillService from "../service/bill.service";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {log} from "../server";
import {ObjectId} from "mongodb";
import {InfoPayType} from "../types/infoPay.type";

const TAG = "Bill Controller"
const billService = BillService.newInstance();

export const runBillController = (app: Express) => {
    app.get("/api/bills/:_id", (
            req: Request<{
                _id: ObjectId
            }, any, any, any, any>,
            res) => {
            log(TAG, "save bill", req.body)
            if (!req.params._id) {
                res.status(404).send("Bad request")
                return
            }

            billService.getBills(req.params._id)
                .then((data) => {
                    res.send(Builder<ResponseApi<InfoPayType[]>>()
                        .code(202)
                        .message("Thành công!")
                        .data(data)
                        .build())
                })
                .catch((error) => {
                    res.status(404).send('Bad request')
                })
        }
    )
}



