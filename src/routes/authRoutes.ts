import * as AuthController from "../controllers/AuthController";
import { validateRequest } from "../middleware/ValidateRequest";
import { LoginRequest } from '../middleware/requests/AuthRequests';

export function authRoutes(server: any) {

  server.post('/login', LoginRequest, validateRequest, AuthController.authenticate)

};