import {forgetPassword, login, register, resetPassword, verify} from "../service/user.service";
import {Express, Request} from "express";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {UserHasPasswordType} from "../types/userHasPassword.type";
import {log} from "../server";
import {ResetPasswordRequest} from "../requests/resetPassword.request";
import {ObjectId} from "mongodb";

const TAG = "Authentication Controller"

export const runAuthController = (app: Express) => {
    app.post("/api/auth/login", (req, res) => {
        log(TAG, "Login", req.body)
        login(req.body).then((data) => {
            res.send(Builder<ResponseApi<UserHasPasswordType>>()
                .code(202)
                .message("Thành công!")
                .data(data)
                .build())
        }).catch((error) => {
            res.status(error.code).send(error)
        })
    });

    app.post("/api/auth/register", (req, res) => {
        log(TAG, "Register", req.body)
        register(req.body).then((data) => {
            res.send(Builder<ResponseApi<UserHasPasswordType>>()
                .code(202)
                .message(`Mã xác thực là: ${data.verifyCode}`)
                .data(data)
                .build())
        }).catch((error) => {
            res.status(error.code).send(error)
        })
    });

    app.post("/api/auth/reset-password", (
        req: Request<any, any, ResetPasswordRequest, any, any>,
        res) => {
        log(TAG, "Reset password", req.body)
        resetPassword(req.body)
            .then((data) => {
                res.send(Builder<ResponseApi<boolean>>()
                    .code(202)
                    .message("Thành công!")
                    .data(data)
                    .build())
            }).catch((error) => {
            res.status(error.code).send(error.message)
        })
    });

    app.post("/api/auth/verify", (req, res) => {
        log(TAG, "Verify", req.body)
        verify(req.body)
            .then((data) => {
                res.send(Builder<ResponseApi<boolean>>()
                    .code(202)
                    .message("Thành công!")
                    .data(data)
                    .build())
            }).catch((error) => {
            res.status(error.code).send(error)
        })
    });

    app.post("/api/auth/forget-password", (
        req
        , res
    ) => {
        log(TAG, "Forget password", req.body)
        forgetPassword(req.body.username)
            .then((data) => {
                res.send(Builder<ResponseApi<{ _id: ObjectId }>>()
                    .code(202)
                    .message("Thành công!")
                    .data({"_id": data})
                    .build())
            }).catch((error) => {
            res.status(error.code).send(error)
        })
    });
}

