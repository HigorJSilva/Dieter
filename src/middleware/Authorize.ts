import { Request, Response, Next  } from "restify";
import * as jwtService from 'jsonwebtoken'
import errors from 'restify-errors';
import { ApiResponse } from '../helpers/ApiResponse';
import { unauthorizedError } from '../helpers/ErrorMessages';

export function authorize() {

    return [

        async (req: Request, res: Response, next: Next) => {
            const auth = <string> req.headers["authorization"]

            if(!auth){
                return throwUnauthorizedError(next);
            }

            let jwtVerified = jwtService.verify( auth.split(' ')[1], <string>process.env.SECRET);
            if (!jwtVerified) {
                return throwUnauthorizedError(next);
            }

            req.params.user = jwtService.decode(auth.split(' ')[1]);
            return next();
        }

    ];
}

function throwUnauthorizedError(next: Next) {
    const error = new errors.UnauthorizedError({
        info: new ApiResponse(false, unauthorizedError, null, null)
    });
    return next(error);
}

