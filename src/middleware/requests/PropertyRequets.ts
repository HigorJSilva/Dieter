import { body, param } from "express-validator";
import * as ErrorMessages from '../../helpers/ErrorMessages'
import { Property } from "../../models/Property";
import { authorizeAction, phone } from "../customRules/CustomRules";
import { AuthenticatedUserRequest } from "./AuthRequests";

export const StorePropertyRequest = [
    ...AuthenticatedUserRequest,
    body('name')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .isLength({ min: 3 }).withMessage(ErrorMessages.fieldSizeMessage(3)),
    body('address')
        .optional({checkFalsy: true})
        .isLength({ min: 6 }).withMessage(ErrorMessages.fieldSizeMessage(6)),
    body('waterCompanyId')
        .optional({checkFalsy: true}),
    body('electricityCompanyId')
        .optional({checkFalsy: true})
];

export const UpdatePropertyRequest = [
    ...StorePropertyRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req})=> authorizeAction(Property, resourceId, req.params!.user.id)).withMessage(ErrorMessages.unauthorizedError)
];

export const searchPropertyRequest = [
    ...AuthenticatedUserRequest,
    param('search')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
];

export const DeletePropertyRequest = [
    ...AuthenticatedUserRequest,
    param('id')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .custom((resourceId, {req})=> authorizeAction(Property, resourceId, req.params!.user.id)).withMessage(ErrorMessages.unauthorizedError)
];