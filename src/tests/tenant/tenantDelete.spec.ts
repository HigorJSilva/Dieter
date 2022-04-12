import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { requiredMessage, resourceNotFoundError, unauthorizedError } from '../../helpers/ErrorMessages';
import { IUser } from '../../models/User';
import server from '../../server'

chai.use(chaiHttp);

let error: any, response: any;
let requestData: IUser | {};

let token: string;
let requestToken: string;

let tenantId: number;
let tenantIdRequest: number;

let login = {
  'email':  'user@gmail.com',
  'password':  '12345'
}

let tenant = {
  'name':  'Tenant to Update',
  'email':  'tenant@email.com'
}

before(function(done) {
  chai.request(server)
    .post('/login')
    .send(login)
    .end((err, res) => {
      error = err, response = res;
      token = requestToken = response.body.data.token
      done();
  });
});

before(function(done) {
  let setAuth = checkToken();
  chai.request(server)
    .post('/tenant')
    .set(setAuth)
    .send(tenant)
    .end((err, res) => {
      error = err, response = res;
      tenantId = tenantIdRequest = response.body.data.id
      token = ''
      done();
  });
});

beforeEach(function (done) {
  let setAuth = checkToken();
  chai.request(server)
    .delete(`/tenant/${tenantId === 0 ? '' : tenantId}`)
    .set(setAuth)
    .send(requestData)
    .end((err, res) => {
      response = res;
      done();
    });
});

function checkToken() {
  return token !== '' ? { "Authorization": `Bearer ${token}` } : {};
}
describe("Testing delete tenant route for exception flows", function() {

  describe("Delete tenant when user not logged in", function() {

    it("it should not delete tenant when user is not logged in", function() {
      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${unauthorizedError}' user not logged in`, function() {
      expect(response.body.message).to.eql(unauthorizedError);
    });

    it('it should return statusCode Unauthorized (401)', function() {
      tenantId = 7;
      token = requestToken;
      expect(response.statusCode).to.be.eql(401);
    });

  });

  describe("Delete another user's tenant ", function() {
    
    it("it should not delete another user's tenant", function() {
      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${resourceNotFoundError('Resource')}' when tring to delete another user's tenant`, function() {
      expect(response.body.message).to.eql(resourceNotFoundError('Resource'));
    });

    it('it should return statusCode Not Found (404)', function() {
      token = requestToken;
      tenantId = 0;
      expect(response.statusCode).to.be.eql(404);
    });

  });

  describe("Delete tenant not provinding id", function() {

    it("it should not delete tenant id is not provided", function() {

      expect(response.body.status).to.be.eql(false);
    });

    it("it should return required field message when id is not provided ", function() {
      expect(response.body.errors).to.have.property('id')
      expect(response.body.errors.id[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      tenantId = tenantIdRequest;
      expect(response.statusCode).to.be.eql(422);
    });

  });

});

describe("Testing delete tenant routes for acceptance flow", function() {

  describe("Delete tenant when correct Id is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return null", function() {
      
      expect(response.body.data).to.be.eql(null)
    });

  });

});
