import * as UserController from "../controllers/UserController";
import { validateRequest } from "../middleware/ValidateRequest";
import { StoreUserRequest } from '../middleware/requests/UserRequests';

export function userRoutes(prefix: string,server: any) {

  server.post(prefix, StoreUserRequest, validateRequest, UserController.storeUser)

};