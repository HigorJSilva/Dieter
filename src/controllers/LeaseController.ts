import {Request, Response, Next} from 'restify'
import { ApiResponse } from '../helpers/ApiResponse';
import { getFilteredRequest } from '../helpers/Utils';
import { ILease, ILeaseCrud } from '../models/Lease';
import * as LeaseService from '../services/LeaseService';


export async function indexLease(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const leases = await LeaseService.indexLease(filteredRequest.user.id)

    if(leases instanceof Error){
        return next(leases)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, leases, null))
}

export async function storeLease(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ILease & ILeaseCrud> getFilteredRequest(req);
    const lease = await LeaseService.storeLease(filteredRequest)

    if(lease instanceof Error){
        return next(lease)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, lease, null))
}

export async function searchLease(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const leases = await LeaseService.searchLease(filteredRequest.id, filteredRequest.user.id)

    if(leases instanceof Error){
        return next(leases)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, leases, null))
}

export async function updateLease(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ILease & ILeaseCrud> getFilteredRequest(req);
    const lease = await LeaseService.updateLease(filteredRequest)

    if(lease instanceof Error){
        return next(lease)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, lease, null))
}

export async function deactivateLease(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ILease & ILeaseCrud> getFilteredRequest(req);
    const lease = await LeaseService.deactivateLease(filteredRequest)

    if(lease instanceof Error){
        return next(lease)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, lease, null))
}

export async function showPastLeases(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const leases = await LeaseService.indexLease(filteredRequest.user.id, false)

    if(leases instanceof Error){
        return next(leases)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, leases, null))
}