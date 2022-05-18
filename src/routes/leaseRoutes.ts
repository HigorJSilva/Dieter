import * as LeaseController from "../controllers/LeaseController";
import { validateRequest } from "../middleware/ValidateRequest";
import { authorize } from "../middleware/Authorize";
import { AuthenticatedUserRequest } from "../middleware/requests/AuthRequests";
import { searchLeaseByPropertyRequest, searchLeaseRequest, StoreLeaseRequest, UpdateLeaseRequest } from "../middleware/requests/LeaseRequets";

export function leaseRoutes(prefix: string,server: any) {

  server.get(prefix, authorize(), AuthenticatedUserRequest, validateRequest, LeaseController.indexLease)
  server.get(`${prefix}/past-leases`, authorize(), AuthenticatedUserRequest, validateRequest, LeaseController.showPastLeases)
  server.post(prefix, authorize(), StoreLeaseRequest, validateRequest, LeaseController.storeLease)
  server.get(`${prefix}/:id`, authorize(), searchLeaseRequest, validateRequest, LeaseController.searchLease)
  server.put(`${prefix}/:id`, authorize(), UpdateLeaseRequest, validateRequest, LeaseController.updateLease)
  server.post(`${prefix}/:id`, authorize(), searchLeaseByPropertyRequest, validateRequest, LeaseController.getLeaseByProperty)

};