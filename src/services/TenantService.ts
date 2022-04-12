import { ITenant, ITenantCrud, Tenant } from "../models/Tenant";
import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";import { errorCreateResorce, errorDeleteResorce, errorListResorce, errorUpdateResorce, resourceNotFoundError } from "../helpers/ErrorMessages";
import { DataTypes } from "sequelize";
import { replaceUndefinedFields } from "../helpers/Utils";

export async function indexTenant(userId: number) {
    try {
        
        const tenants = await Tenant.findAll({where:{
            userId: userId
        }})

        return tenants;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorListResorce('tenants'), null, error.message)
        })
    }
}


export async function storeTenant(tenant: ITenant & ITenantCrud) {
    try {
        tenant.userId = tenant.user.id;

        const newTenant = await Tenant.create({...tenant})
        return replaceUndefinedFields(newTenant.get());

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorCreateResorce('tenant'), null, error.message)
        })
    }
}

export async function searchTenant(search: string, userId: string) {
    try {
        let searchTenant;
        if(/^\d+$/.test(search)){
            searchTenant = await Tenant.findByPk(search)
        }
        else{
            searchTenant = await Tenant.findAll({
                where:{
                    userId: userId,
                    $or:[
                        { name: {$like: `%${search}%`}},
                        { email: {$like: `%${search}%`}},
                    ]
                }
            })
        }

        return searchTenant;
    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, resourceNotFoundError('Tenant'), null, error.message)
        })
    }
}

export async function updateTenant(tenant: ITenant & ITenantCrud) {
    try {
        tenant.userId = tenant.user.id;

        const updatedtenant =  await Tenant.findOne({ where: { 
                id: `${tenant.id}`,
                userId:`${tenant.userId}`,
            }
        });
        
        updatedtenant!.update(
            {...tenant},
            { where: { 
                    id: `${tenant.id}`,
                    userId:`${tenant.userId}`,
                }
            },
            
        );

        return updatedtenant;

    } catch (error: any) {
        if(error instanceof errors.NotFoundError){
            return new errors.NotFoundError({
                info: new ApiResponse(false, resourceNotFoundError('Tenant'), null, null)
            })
        }
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorUpdateResorce('tenant'), null, error.message)
        })
    }
}

export async function deleteTenant(id: DataTypes.BigIntDataType) {
    try {
        
        await Tenant.destroy({
            where: {
                id: `${id}`,
            }
        })

        return true;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorDeleteResorce('tenant'), null, error.message)
        })
    }
}