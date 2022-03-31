import { IUser, User } from "../models/User";
import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";

export async function storeUser(user: IUser) {
    try {
        const newUser = await User.create({...user})
        return {id: newUser.getDataValue('id')};
    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, 'Store user failed', null, error.message)
        })
    }
    

    
}