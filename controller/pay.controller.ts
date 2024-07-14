import {Express, Request} from "express";
import {PayRequest} from "../requests/pay.request";
import BillService from "../service/bill.service";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {log} from "../server";

const TAG = "Pay Controller"
const billService = BillService.newInstance();

export const runPayController = (app: Express) => {
    app.post("/api/pay", (
            req: Request<any, any, PayRequest, any, any>,
            res) => {
            log(TAG, "save bill", req.body)

            billService.saveBill(req.body)
                .then(() => {
                    res.send(Builder<ResponseApi<boolean>>()
                        .code(202)
                        .message("Thành công!")
                        .data(true)
                        .build())
                })
                .catch((error) => {
                    res.status(error.code).send(error.message)
                })
        }
    )
}



