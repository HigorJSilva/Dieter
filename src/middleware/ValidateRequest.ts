import {Next, Request, Response} from 'restify';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../helpers/ApiResponse'
import * as _ from "lodash";
import { handleErrorMessage } from '../helpers/HandleErrorMessage';
import { resourceNotFoundError, unauthorizedError } from '../helpers/ErrorMessages';

export function validateRequest (
    req: Request,
    res: Response,
    next: Next,
){
    const errors = validationResult(req) ;
    if(!errors.isEmpty()){

      let errorsArray = handleErrorMessage(errors.array())

      if(errorsArray.id?.length > 0){
        if(errorsArray.id[0] === unauthorizedError){
          res.status(404)
          res.json( new ApiResponse(false, resourceNotFoundError('Resource'), null, null))
          return
        }
      }

      res.status(422)
      res.json( new ApiResponse(false, 'Bad Request', null, errorsArray))
      return;
    }

    next();
}