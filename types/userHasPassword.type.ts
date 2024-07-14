import {User} from "./user.type";

export type UserHasPasswordType = User & {
    password?: string,
    verifyCode?: string,
}
