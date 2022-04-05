import * as UserController from "../controllers/UserController";
import { validateRequest } from "../middleware/ValidateRequest";
import { StoreUserRequest } from '../middleware/requests/UserRequests';
import { authorize } from "../middleware/Authorize";
import { AuthenticatedUserRequest } from "../middleware/requests/AuthRequests";

export function userRoutes(prefix: string,server: any) {

  server.post(prefix, StoreUserRequest, validateRequest, UserController.storeUser)
  server.get(`${prefix}/me`, authorize(), AuthenticatedUserRequest, validateRequest, UserController.me)

};