import {Request, Response, Next} from 'restify'
import { ApiResponse } from '../helpers/ApiResponse';
import { getFilteredRequest } from '../helpers/Utils';
import { IUser } from '../models/User';
import * as userService from '../services/UserService';

export async function storeUser(req: Request, res:Response, next: Next){
   
    const filteredRequest = <IUser> getFilteredRequest(req);
    const user = await userService.storeUser(filteredRequest)

    if(user instanceof Error){
        return next(user)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, user, null))
}

export async function me(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const user = await userService.me(filteredRequest.user.id)

    if(user instanceof Error){
        return next(user)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, user, null))
}