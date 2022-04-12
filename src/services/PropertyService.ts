import { IProperty, IPropertyCrud, Property } from "../models/Property";
import errors from 'restify-errors'
import { ApiResponse } from "../helpers/ApiResponse";import { errorCreateResorce, errorDeleteResorce, errorListResorce, errorUpdateResorce, resourceNotFoundError } from "../helpers/ErrorMessages";
import { DataTypes } from "sequelize";
import { replaceUndefinedFields } from "../helpers/Utils";

export async function indexProperty(userId: number) {
    try {
        
        const properties = await Property.findAll({where:{
            userId: userId
        }})

        return properties;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorListResorce('property'), null, error.message)
        })
    }
}


export async function storeProperty(property: IProperty & IPropertyCrud) {
    try {
        property.userId = property.user.id;

        const newProperty = await Property.create({...property})
        return replaceUndefinedFields(newProperty.get());

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorCreateResorce('property'), null, error.message)
        })
    }
}

export async function searchProperty(search: string, userId: string) {
    try {
        let searchProperty;
        if(/^\d+$/.test(search)){
            searchProperty = await Property.findByPk(search)
        }
        else{
            searchProperty = await Property.findAll({
                where:{
                    userId: userId,
                    $or:[
                        { name: {$like: `%${search}%`}},
                        { address: {$like: `%${search}%`}},
                    ]
                }
            })
        }

        return searchProperty;
    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, resourceNotFoundError('Property'), null, error.message)
        })
    }
}

export async function updateProperty(property: IProperty & IPropertyCrud) {
    try {
        property.userId = property.user.id;

        const updatedProperty = await Property.findOne({ where: { 
                id: `${property.id}`,
                userId:`${property.userId}`,
            }
        });
        
        updatedProperty!.update(
            {...property},
            { where: { 
                    id: `${property.id}`,
                    userId:`${property.userId}`,
                }
            },
            
        );

        return updatedProperty;

    } catch (error: any) {
        if(error instanceof errors.NotFoundError){
            return new errors.NotFoundError({
                info: new ApiResponse(false, resourceNotFoundError('Property'), null, null)
            })
        }
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorUpdateResorce('property'), null, error.message)
        })
    }
}

export async function deleteProperty(id: DataTypes.BigIntDataType) {
    try {
        
        await Property.destroy({
            where: {
                id: `${id}`,
            }
        })

        return true;

    } catch (error: any) {
        return new errors.UnprocessableEntityError({
            info: new ApiResponse(false, errorDeleteResorce('property'), null, error.message)
        })
    }
}