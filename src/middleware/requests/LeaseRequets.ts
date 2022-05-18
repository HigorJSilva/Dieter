import { body, param } from "express-validator";
import { PAYMENTFREQUENCIES } from "../../helpers/Constants";
import * as ErrorMessages from '../../helpers/ErrorMessages'
import { Lease } from "../../models/Lease";
import { Property } from "../../models/Property";
import { Tenant } from "../../models/Tenant";
import { authorizeAction, inArray } from "../customRules/CustomRules";
import { AuthenticatedUserRequest } from "./AuthRequests";

export const StoreLeaseRequest = [
    ...AuthenticatedUserRequest,
    body('propertyId')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((propertyId, {req}) => authorizeAction(Property, propertyId, req.params!.user.id )).withMessage(ErrorMessages.resourceNotFoundError('Property')),
    body('tenantId')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((tenantId, {req}) => authorizeAction(Tenant, tenantId, req.params!.user.id )).withMessage(ErrorMessages.resourceNotFoundError('Tenant')),
    body('value')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .isFloat(),
    body('startDate')
        .optional({checkFalsy: true})
        .isDate(),
    body('endDate')
        .optional({checkFalsy: true})
        .isDate(),
    body('paymentFrequency')
        .optional({checkFalsy: true})
        .custom(paymentFrequency => inArray(paymentFrequency, PAYMENTFREQUENCIES, "value")),
    body('active')
        .optional({checkFalsy: true})
        .isBoolean()
        

];

export const UpdateLeaseRequest = [
    ...StoreLeaseRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req}) => authorizeAction(Lease, resourceId, req.params!.user.id)).withMessage(ErrorMessages.unauthorizedError)
];

export const searchLeaseRequest = [
    ...AuthenticatedUserRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
];

export const DeactivateLeaseRequest = [
    ...AuthenticatedUserRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req})=> authorizeAction(Lease, resourceId, req.params!.user.id)).withMessage(ErrorMessages.unauthorizedError)
];

export const searchLeaseByPropertyRequest = [
    ...AuthenticatedUserRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail(),
    body('status')
        .optional({checkFalsy: true})
        .isBoolean()
];