import { IUser, User } from "../models/User";
import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";
import { errorCreateUsers, resourceNotFoundError } from "../helpers/ErrorMessages";

export async function storeUser(user: IUser) {
    try {
        
        const newUser = await User.create({...user})
        const { password, ...protectedUser } = newUser.get();

        return protectedUser;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorCreateUsers, null, error.message)
        })
    }
}

export async function me(userId: number) {
    try {
        
        const newUser = await User.findByPk(userId)
        const { password, id, ...protectedUser } = newUser!.get();

        return protectedUser;
    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, resourceNotFoundError('User'), null, error.message)
        })
    }
}