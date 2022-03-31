import { body } from "express-validator";
import * as ErrorMessages from '../../helpers/ErrorMessages'
import { User } from "../../models/User";
import { unique } from "../customRules/CustomRules";

export interface RegisterInterface {
    email: string,
    password: number,
}

export const StoreUserRequest = [
    body('email')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .normalizeEmail()
        .isEmail().withMessage(ErrorMessages.invalidEmailMessage)
        .custom(async (value: string) => unique(value, 'email', User)).withMessage(ErrorMessages.uniqueMessage),

    body('password')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .isLength({ min: 5 }).withMessage(ErrorMessages.fieldSizeMessage(5))
];