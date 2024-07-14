export type CustomError<T> = {
    code: number
    message: string,
    data?: T
}