import { body, param } from "express-validator";
import * as ErrorMessages from '../../helpers/ErrorMessages'

export interface ILogin {
    email: string,
    password: string,
}

export const LoginRequest = [
    body('email')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .normalizeEmail()
        .isEmail().withMessage(ErrorMessages.invalidEmailMessage),
    body('password')
        .notEmpty().withMessage(ErrorMessages.requiredMessage).bail()
        .isLength({ min: 5 }).withMessage(ErrorMessages.fieldSizeMessage(5))
];

export const AuthenticatedUserRequest = [
    param('user.id')
        .notEmpty().withMessage(ErrorMessages.unauthorizedError).bail()
];