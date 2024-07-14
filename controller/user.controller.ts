import {Express, Request} from "express";
import {Builder} from "builder-pattern";
import {ResponseApi} from "../types/response.type";
import {log} from "../server";
import {User} from "../types/user.type";
import {changePassword, updateProfile} from "../service/user.service";
import {ChangePasswordRequest} from "../requests/changePassword.request";

const TAG = "User Controller"

export const runUserController = (app: Express) => {
    app.put("/api/user/update-profile", (
        req: Request<any, any, User, any, any>,
        res) => {
        log(TAG, "update profile", req.body)
        updateProfile(req.body)
            .then((data) => {
                res.send(Builder<ResponseApi<User>>()
                    .code(202)
                    .message("Thành công!")
                    .data(data)
                    .build())
            }).catch((error) => {
            res.status(error.code).send(error)
        })
    });
    app.put("/api/user/change-password", (
        req: Request<any, any, ChangePasswordRequest, any, any>,
        res) => {
        log(TAG, "Change password", req.body)
        changePassword(req.body)
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

}

