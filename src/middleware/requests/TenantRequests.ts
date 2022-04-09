import { body, param } from "express-validator";
import * as ErrorMessages from '../../helpers/ErrorMessages'
import { Tenant } from "../../models/Tenant";
import { authorizeAction, phone } from "../customRules/CustomRules";
import { AuthenticatedUserRequest } from "./AuthRequests";

export interface ITenantRequest {
    name: string,
    email?: string,
    phone?: string,
}

export const StoreTenantRequest = [
    ...AuthenticatedUserRequest,
    body('name')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .isLength({ min: 3 }).withMessage(ErrorMessages.fieldSizeMessage(3)),
    body('email')
        .optional({checkFalsy: true})
        .normalizeEmail()
        .isEmail().withMessage(ErrorMessages.invalidEmailMessage),
    body('phone')
        .optional({checkFalsy: true})
        .custom(value => phone(value)).withMessage(ErrorMessages.invalidPhoneMessage)
];

export const UpdateTenantRequest = [
    ...StoreTenantRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req})=> authorizeAction(Tenant, resourceId, req.params!.user.id)).withMessage(ErrorMessages.resourceNotFoundError('Tenant'))
];

export const searchTenantRequest = [
    ...AuthenticatedUserRequest,
    param('search')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
];

export const DeleteTenantRequest = [
    ...AuthenticatedUserRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req})=> authorizeAction(Tenant, resourceId, req.params!.user.id)).withMessage(ErrorMessages.resourceNotFoundError('Tenant'))
];