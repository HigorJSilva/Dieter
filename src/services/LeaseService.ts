import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";import { errorCreateResorce, errorListResorce, errorUpdateResorce, propertyInUseError, updatedDeactivatedLease,resourceNotFoundError } from "../helpers/ErrorMessages";
import { replaceUndefinedFields } from "../helpers/Utils";
import { ILease, ILeaseCrud, Lease } from "../models/Lease";
import { Property } from '../models/Property';
import { Tenant } from '../models/Tenant';

export async function indexLease(userId: number, status = true) {
    try {
        
        const leases = await Lease.findAll({
            include: [ { model: Tenant, as: 'tenant' }, { model: Property, as: 'property' } ],
            where:{
                userId: userId,
                active: status
            }
        });

        return leases;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorListResorce('lease'), null, error.message)
        });
    }
}


export async function storeLease(lease: ILease & ILeaseCrud) {
    try {
        lease.userId = lease.user.id;

        let searchLease = await Lease.findAll({
            where:{
                propertyId: `${lease.propertyId}`,
                active: true,
            }
        });

        if(searchLease){
            throw new Error(propertyInUseError);
        }

        const newLease = await Lease.create({...lease})
        return replaceUndefinedFields(newLease.get());

    } catch (error: any) {

        if(error.message == propertyInUseError){
            return new errors.UnprocessableEntityError({
                info: new ApiResponse(false, error.message, null, null)
            })
        }

        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorCreateResorce('lease'), null, error.message)
        });
    }
}

export async function searchLease(search: string, userId: string) {
    try {
        let searchLease;
        if(/^\d+$/.test(search)){
            searchLease = await Lease.findByPk(search, 
                {
                    include: [ { model: Tenant, as: 'tenant' }, { model: Property, as: 'property' } ]
                }
            );
        }
        else{
            searchLease = await Lease.findAll({
                include: [ { model: Tenant, as: 'tenant' }, { model: Property, as: 'property' } ],
                where:{
                    userId: userId,
                    $or:[
                        { name: {$like: `%${search}%`}},
                        { address: {$like: `%${search}%`}},
                    ]
                }
            });
        }

        return searchLease;
    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, resourceNotFoundError('Lease'), null, error.message)
        });
    }
}

export async function updateLease(lease: ILease & ILeaseCrud) {
    try {
        lease.userId = lease.user.id;

        const updatedLease = <ILease> await Lease.findOne({ 
            include: [ { model: Tenant, as: 'tenant' }, { model: Property, as: 'property' } ],
            where: { 
                id: `${lease.id}`,
                userId:`${lease.userId}`,
            }
        });

        if(!(updatedLease.active)){
            throw new Error(updatedDeactivatedLease);
        }
        
        updatedLease!.update(
            {...lease},
            { where: { 
                    id: `${lease.id}`,
                    userId:`${lease.userId}`,
                }
            },
            
        );

        return updatedLease;

    } catch (error: any) {

        if(error.message = updatedDeactivatedLease){
            return new errors.NotFoundError({
                info: new ApiResponse(false, updatedDeactivatedLease, null, null)
            });
        }

        if(error instanceof errors.NotFoundError){
            return new errors.NotFoundError({
                info: new ApiResponse(false, resourceNotFoundError('Lease'), null, null)
            });
        }
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorUpdateResorce('lease'), null, error.message)
        });
    }
}

export async function deactivateLease(lease: ILease & ILeaseCrud) {
    try {
        lease.userId = lease.user.id;

        const updatedLease = await Lease.findOne({ 
            where: { 
                id: `${lease.id}`,
                userId:`${lease.userId}`,
            }
        });
        
        updatedLease!.update(
            {active: false},
            { 
                where: { 
                    id: `${lease.id}`,
                    userId:`${lease.userId}`,
                }
            },
            
        );

        return updatedLease;

    } catch (error: any) {
        if(error instanceof errors.NotFoundError){
            return new errors.NotFoundError({
                info: new ApiResponse(false, resourceNotFoundError('Lease'), null, null)
            });
        }
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorUpdateResorce('lease'), null, error.message)
        });
    }
}

// export async function changeActiveStatus(id: DataTypes.BigIntDataType) {
    
//     try {
        
//         await Property.destroy({
//             where: {
//                 id: `${id}`,
//             }
//         })

//         return true;

//     } catch (error: any) {
//         return new errors.UnprocessableEntityError({
//             info: new ApiResponse(false, errorDeleteResorce('lease'), null, error.message)
//         })
//     }
// }