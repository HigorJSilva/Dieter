import { authRoutes } from './authRoutes';
import { tenantRoutes } from './tenantRoutes';
import { testRoutes } from './testRoutes';
import { userRoutes } from './usersRoutes';
import { propertyRoutes } from './propertyRoutes';

export default(server: any) => {
    testRoutes(server);
    userRoutes('/user',server);
    authRoutes(server);
    tenantRoutes('/tenant',server);
    propertyRoutes('/property',server);
};