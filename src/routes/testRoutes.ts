import { Response, Next } from "restify";
import errors from 'restify-errors'

export function testRoutes(server: any) {

  server.get('/test', function(req: Request, res: Response, next: Next) {
    let test = {
        status:true,
        message: null,
        data: [{id: 1 , name: "test name"}],
        erros: null,
    }
    
    return res.json(test);
});

    server.get('/error-test', function(req: Request, res: Response, next: Next) {
        let errorTest = {
            message: 'Listing error',
            data: null,
            erros: [{ 'field':['is required', 'is not string']}],
        }
        
        let err = new errors.UnprocessableEntityError({
        info: errorTest
        });
        
        return next(err);
    }); 
  };