import * as LeaseController from "../controllers/LeaseController";
import { validateRequest } from "../middleware/ValidateRequest";
import { authorize } from "../middleware/Authorize";
import { AuthenticatedUserRequest } from "../middleware/requests/AuthRequests";
import { DeactivateLeaseRequest, searchLeaseRequest, StoreLeaseRequest, UpdateLeaseRequest } from "../middleware/requests/LeaseRequets";

export function leaseRoutes(prefix: string,server: any) {

  server.get(prefix, authorize(), AuthenticatedUserRequest, validateRequest, LeaseController.indexLease)
  server.post(prefix, authorize(), StoreLeaseRequest, validateRequest, LeaseController.storeLease)
  server.get(`${prefix}/:id`, authorize(), searchLeaseRequest, validateRequest, LeaseController.searchLease)
  server.put(`${prefix}/:id`, authorize(), UpdateLeaseRequest, validateRequest, LeaseController.updateLease)
  server.get(`${prefix}/:id/deactivate`, authorize(), DeactivateLeaseRequest, validateRequest, LeaseController.deactivateLease)

};