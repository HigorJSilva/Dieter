import { Next, Request, Response } from 'restify';
import { ApiResponse } from '../helpers/ApiResponse';
import { getFilteredRequest } from '../helpers/Utils';
import { ILogin } from '../middleware/requests/AuthRequests';
import * as AuthService from '../services/AuthService';


export async function authenticate(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ILogin> getFilteredRequest(req);
    const login = await AuthService.authenticate(filteredRequest)

    if(login instanceof Error){
        return next(login)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, login, null))
}