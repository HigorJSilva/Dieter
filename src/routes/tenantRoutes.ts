import * as TenantController from "../controllers/TenantController";
import { validateRequest } from "../middleware/ValidateRequest";
import { authorize } from "../middleware/Authorize";
import { AuthenticatedUserRequest } from "../middleware/requests/AuthRequests";
import { DeleteTenantRequest, searchTenantRequest, StoreTenantRequest, UpdateTenantRequest } from "../middleware/requests/TenantRequests";

export function tenantRoutes(prefix: string,server: any) {

  server.get(prefix, authorize(), AuthenticatedUserRequest, validateRequest, TenantController.indexTenant)
  server.post(prefix, authorize(), StoreTenantRequest, validateRequest, TenantController.storeTenant)
  server.get(`${prefix}/:search`, authorize(), searchTenantRequest, validateRequest, TenantController.searchTenant)
  server.put(`${prefix}/:id`, authorize(), UpdateTenantRequest, validateRequest, TenantController.updateTenant)
  server.del(`${prefix}/:id`, authorize(), DeleteTenantRequest, validateRequest, TenantController.deleteTenant)

};