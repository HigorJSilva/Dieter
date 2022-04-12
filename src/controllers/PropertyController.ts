import {Request, Response, Next} from 'restify'
import { ApiResponse } from '../helpers/ApiResponse';
import { getFilteredRequest } from '../helpers/Utils';
import { IProperty, IPropertyCrud } from '../models/Property';
import * as propertyService from '../services/PropertyService';


export async function indexProperty(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const properties = await propertyService.indexProperty(filteredRequest.user.id)

    if(properties instanceof Error){
        return next(properties)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, properties, null))
}

export async function storeProperty(req: Request, res:Response, next: Next){
   
    const filteredRequest = <IProperty & IPropertyCrud > getFilteredRequest(req);
    const properties = await propertyService.storeProperty(filteredRequest)

    if(properties instanceof Error){
        return next(properties)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, properties, null))
}

export async function searchProperty(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const properties = await propertyService.searchProperty(filteredRequest.search, filteredRequest.user.id)

    if(properties instanceof Error){
        return next(properties)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, properties, null))
}

export async function updateProperty(req: Request, res:Response, next: Next){
   
    const filteredRequest = <IProperty & IPropertyCrud > getFilteredRequest(req);
    const property = await propertyService.updateProperty(filteredRequest)

    if(property instanceof Error){
        return next(property)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, null, null))
}

export async function deleteProperty(req: Request, res:Response, next: Next){
   
    const filteredRequest = getFilteredRequest(req);
    const property = await propertyService.deleteProperty(filteredRequest.id)

    if(property instanceof Error){
        return next(property)
    }
    
    res.status(200);
    return res.json( new ApiResponse(true, null, null, null))
}