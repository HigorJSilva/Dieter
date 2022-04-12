import * as PropertyController from "../controllers/PropertyController";
import { validateRequest } from "../middleware/ValidateRequest";
import { authorize } from "../middleware/Authorize";
import { AuthenticatedUserRequest } from "../middleware/requests/AuthRequests";
import { DeletePropertyRequest, searchPropertyRequest, StorePropertyRequest, UpdatePropertyRequest } from "../middleware/requests/PropertyRequets";

export function propertyRoutes(prefix: string,server: any) {

  server.get(prefix, authorize(), AuthenticatedUserRequest, validateRequest, PropertyController.indexProperty)
  server.post(prefix, authorize(), StorePropertyRequest, validateRequest, PropertyController.storeProperty)
  server.get(`${prefix}/:search`, authorize(), searchPropertyRequest, validateRequest, PropertyController.searchProperty)
  server.put(`${prefix}/:id`, authorize(), UpdatePropertyRequest, validateRequest, PropertyController.updateProperty)
  server.del(`${prefix}/:id`, authorize(), DeletePropertyRequest, validateRequest, PropertyController.deleteProperty)

};