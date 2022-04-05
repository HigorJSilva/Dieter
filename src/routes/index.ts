import { authRoutes } from './authRoutes';
import { testRoutes } from './testRoutes';
import { userRoutes } from './usersRoutes';

export default(server: any) => {
    testRoutes(server);
    userRoutes('/user',server);
    authRoutes(server);
};