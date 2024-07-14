import {CustomError} from "./custom.error.type";
import {ObjectId} from "mongodb";

const wrongUsernameOrPassword: CustomError<void> = {
    code: 404,
    message: "Tài khoản hoặc mật khẩu không đúng"
};
const wrongPassword: CustomError<void> = {
    code: 404,
    message: "Mật khẩu không đúng"
};

const wrongVerifyCode: CustomError<void> = {
    code: 404,
    message: "Mã xác thực không đúng"
};
const verifyFail: CustomError<void> = {
    code: 404,
    message: "Xác thực thất bại"
};

const accountNotVerify = (_id: ObjectId): CustomError<ObjectId> => {
   return {
       code: 401,
       message: "Tài khoản chưa được xác thực",
       data: _id
   }
}

const accountExist: CustomError<void> = {
    code: 404,
    message: "Username đã tồn tại"
}

const accountNotExist: CustomError<void> = {
    code: 404,
    message: "Tài khoản chưa được đăng ký"
}
const userNotFound: CustomError<void> = {
    code: 404,
    message: "Tài khoản không tồn tại"
}

const registerFail: CustomError<void> = {
    code: 404,
    message: "Đăng ký thất bại"
}
const passwordNotCompare: CustomError<void> = {
    code: 404,
    message: "Mật khẩu không trùng khớp"
}
const changePasswordFail: CustomError<void> = {
    code: 404,
    message: "Đổi mật khẩu thất bại"
}
const updateProfileFail: CustomError<void> = {
    code: 404,
    message: "Cập nhật thông tin thất bại"
}
const productNotFound: CustomError<void> = {
    code: 404,
    message: "Không tìm thấy sản phẩm"
}
const payFailed: CustomError<void> = {
    code: 404,
    message: "Thanh toán thất bại"
}
const reviewIdNotExists: CustomError <void>= {
    code: 404,
    message: "Id review không tồn tại"
}
const reviewExists: CustomError <void>= {
    code: 404,
    message: "Bạn đã đánh giá sản phẩm này"
}


export {
    wrongUsernameOrPassword,
    wrongVerifyCode,
    accountNotVerify,
    accountExist,
    accountNotExist,
    registerFail,
    verifyFail,
    passwordNotCompare,
    changePasswordFail,
    productNotFound,
    payFailed,
    updateProfileFail,
    wrongPassword,
    userNotFound,
    reviewIdNotExists,
    reviewExists
};