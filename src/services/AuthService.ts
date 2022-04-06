import { IUser, User } from "../models/User";
import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";
import { compareSync} from 'bcrypt';
import { resourceNotFoundError, errorLogin } from "../helpers/ErrorMessages";
import { ILogin } from "../middleware/requests/AuthRequests";
import * as jwt from 'jsonwebtoken';

export async function authenticate(login: ILogin) {
    try {
        
        const user = await <IUser><unknown> User.findOne({ where: {email: login.email} });
        if(!user){
            throw resourceNotFoundError('Email');
        }
        
        if (!compareSync(login. password, <string><unknown>user!.password)){
            throw errorLogin
        }
        
        const token = jwt.sign(user.toJSON(),<string> process.env.SECRET)

        const {password, ...protectedUser} = user.get();
        return { user: protectedUser, token };

    } catch (error: any) {
        if(error ==  resourceNotFoundError('Email') ) {
            return new errors.ResourceNotFoundError({
                info: new ApiResponse(false, resourceNotFoundError('Email'), null, error.message)
            })
        }

       return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorLogin, null, error.message)
        })
    }
}