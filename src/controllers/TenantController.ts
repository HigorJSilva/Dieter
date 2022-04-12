import {Request, Response, Next} from 'restify'
import { ApiResponse } from '../helpers/ApiResponse';
import { getFilteredRequest } from '../helpers/Utils';
import { ITenant, ITenantCrud } from '../models/Tenant';
import * as tenantService from '../services/TenantService';


export async function indexTenant(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const tenants = await tenantService.indexTenant(filteredRequest.user.id)

    if(tenants instanceof Error){
        return next(tenants)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, tenants, null))
}

export async function storeTenant(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ITenant & ITenantCrud > getFilteredRequest(req);
    const tenant = await tenantService.storeTenant(filteredRequest)

    if(tenant instanceof Error){
        return next(tenant)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, tenant, null))
}

export async function searchTenant(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const tenants = await tenantService.searchTenant(filteredRequest.search, filteredRequest.user.id)

    if(tenants instanceof Error){
        return next(tenants)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, tenants, null))
}

export async function updateTenant(req: Request, res:Response, next: Next){
   
    const filteredRequest = <ITenant & ITenantCrud > getFilteredRequest(req);
    const tenant = await tenantService.updateTenant(filteredRequest)

    if(tenant instanceof Error){
        return next(tenant)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, tenant, null))
}

export async function deleteTenant(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const tenant = await tenantService.deleteTenant(filteredRequest.id)

    if(tenant instanceof Error){
        return next(tenant)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, null, null))
}