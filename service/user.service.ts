import {connection} from "../database.connect";
import {UserHasPasswordType} from "../types/userHasPassword.type";
import {
    accountExist,
    accountNotExist,
    accountNotVerify,
    passwordNotCompare,
    registerFail,
    updateProfileFail,
    verifyFail,
    wrongPassword,
    wrongUsernameOrPassword,
    wrongVerifyCode
} from "../errors/error.enum";
import {VerifyRequest} from "../requests/verify.request";
import {LoginRequest} from "../requests/login.request";
import {RegisterRequest} from "../requests/register.request";
import {ChangePasswordRequest} from "../requests/changePassword.request";
import {ObjectId} from "mongodb";
import {User} from "../types/user.type";
import {ResetPasswordRequest} from "../requests/resetPassword.request";

const collection = 'users';
const userRepository = connection.collection<UserHasPasswordType>(collection);

async function existUsername(username?: string): Promise<ObjectId | undefined> {
    if (!username) throw accountNotExist;
    const query = {username: username}
    return userRepository
        .findOne(query)
        .then((response): ObjectId | undefined => {
            return response?._id;
        });
}

async function login(loginRequest: LoginRequest): Promise<UserHasPasswordType> {
    const exist = await existUsername(loginRequest.username);
    if (!exist)
        throw accountNotExist;
    return userRepository
        .findOne(loginRequest)
        .then((response: UserHasPasswordType | null): UserHasPasswordType => {
            if (!response) throw wrongUsernameOrPassword;
            if (response.verifyCode || response.verifyCode === "") throw accountNotVerify(exist);
            response.password = undefined;
            response.verifyCode = undefined;
            return response;
        });
}

async function register(registerRequest: RegisterRequest): Promise<UserHasPasswordType> {
    const exist = await existUsername(registerRequest.username);
    if (registerRequest.password !== registerRequest.confirmPassword) throw passwordNotCompare;
    const user: UserHasPasswordType = {
        ...registerRequest,
        urlAvatar: "https://i.imgur.com/7bIq1J9.png",
        verifyCode: generateVerifyCode(),
    };
    if (exist) throw accountExist;
    return await userRepository
        .insertOne(user)
        .then((response): UserHasPasswordType => {
            if (!response) throw registerFail;
            return {
                _id: user._id,
                verifyCode: user.verifyCode,
            } as UserHasPasswordType;
        })
}

async function verify(verifyRequest: VerifyRequest): Promise<boolean> {
    verifyRequest._id = ObjectId.createFromHexString(verifyRequest._id.toString());
    const exist = await checkUserId(verifyRequest._id);
    if (!exist) throw accountNotExist;
    return userRepository
        .findOneAndUpdate(verifyRequest, {
            $unset: {"verifyCode": ""},
        })
        .then((response): boolean => {
            if (!response) throw wrongVerifyCode;
            return true;
        });
}


async function forgetPassword(username: string): Promise<ObjectId> {
    const exist = await existUsername(username);
    if (!exist) throw accountNotExist;
    return exist;
}

async function changePassword(changePasswordRequest: ChangePasswordRequest): Promise<boolean> {
    if (changePasswordRequest.newPassword !== changePasswordRequest.confirmPassword) throw passwordNotCompare;
    return await userRepository
        .findOneAndUpdate({
                _id: ObjectId.createFromHexString(changePasswordRequest._id.toString()),
                password: changePasswordRequest.currentPassword
            },
            {
                $set: {
                    password: changePasswordRequest.newPassword
                }
            })
        .then((response): boolean => {
            if (!response) throw wrongPassword;
            return true;
        })
}

async function resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<boolean> {
    if (resetPasswordRequest.newPassword !== resetPasswordRequest.confirmPassword) throw passwordNotCompare;
    return await userRepository
        .findOneAndUpdate({
                _id: ObjectId.createFromHexString(resetPasswordRequest._id.toString()),
            },
            {
                $set: {
                    password: resetPasswordRequest.newPassword
                }
            })
        .then((response): boolean => {
            if (!response) throw wrongPassword;
            return true;
        })
}

async function updateProfile(user: User): Promise<User> {
    if (!user._id) throw accountNotExist;
    return await userRepository
        .findOneAndUpdate({_id: ObjectId.createFromHexString(user._id.toString())}, {
            $set: {
                birthday: user.birthday,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                gender: user.gender
            }
        }).then((response): User => {
            if (!response) throw updateProfileFail;
            return user;
        })
}


async function checkUserId(id: ObjectId): Promise<UserHasPasswordType | null> {
    return await userRepository.findOne({_id: id}).then((response) => {
        return response;
    })
}

const generateVerifyCode = () => {
    const number = Math.floor(Math.random() * 999999);
    switch (number.toString().length) {
        case 1:
            return `00000${number}`;
        case 2:
            return `0000${number}`;
        case 3:
            return `000${number}`;
        case 4:
            return `00${number}`;
        case 5:
            return `0${number}`;
        default:
            return `${number}`;
    }
}

export {login, register, verify, forgetPassword, changePassword, checkUserId, updateProfile, resetPassword};
