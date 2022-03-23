import restify from 'restify'
import routes from '../routes'

export const server = restify.createServer();

routes(server);

server.use(restify.plugins.jsonBodyParser());

server.on('restifyError', function (req, res, err, cb) {
 
  err.toJSON = function() {
    return {
      status: false,
      message: err.context.message ?? null,
      data: err.context.data ?? null,
      erros: err.context.erros ?? null
    }
  };

  return res.json(err);
});


