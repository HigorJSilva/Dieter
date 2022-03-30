import {Next, Request, Response} from 'restify';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../helpers/ApiResponse'
import * as _ from "lodash";
import { handleErrorMessage } from '../helpers/HandleErrorMessage';
;

export function validateRequest (
    req: Request,
    res: Response,
    next: Next,
){
    const errors = validationResult(req) ;
    if(!errors.isEmpty()){

      let errorsArray = handleErrorMessage(errors.array())

      res.status(422)
      res.json( new ApiResponse(false, 'Bad Request', null, errorsArray))
      return;
    }

    next();
}