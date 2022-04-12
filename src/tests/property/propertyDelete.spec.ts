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

let propertyId: number;
let propertyIdRequest: number;

let login = {
  'email':  'user@gmail.com',
  'password':  '12345'
}

let property = {
  "name": "Property to update",
  "address": "5th Avenue, 412", 
  "waterCompanyId": "3432-1",
  "electricityCompanyId": null
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
    .post('/property')
    .set(setAuth)
    .send(property)
    .end((err, res) => {
      error = err, response = res;
      propertyId = propertyIdRequest = response.body.data.id
      token = ''
      done();
  });
});

beforeEach(function (done) {
  let setAuth = checkToken();
  chai.request(server)
    .delete(`/property/${propertyId === 0 ? '' : propertyId}`)
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

describe("Testing delete property route for exception flows", function() {

  describe("Delete property when user not logged in", function() {

    it("it should not delete property when user is not logged in", function() {
      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${unauthorizedError}' user not logged in`, function() {
      expect(response.body.message).to.eql(unauthorizedError);
    });

    it('it should return statusCode Unauthorized (401)', function() {
      propertyId = 7;
      token = requestToken;
      expect(response.statusCode).to.be.eql(401);
    });

  });

  describe("Delete another user's property ", function() {
    
    it("it should not delete another user's property", function() {
      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${resourceNotFoundError('Resource')}' when tring to delete another user's property`, function() {
      expect(response.body.message).to.eql(resourceNotFoundError('Resource'));
    });

    it('it should return statusCode Not Found (404)', function() {
      token = requestToken;
      propertyId = 0;
      expect(response.statusCode).to.be.eql(404);
    });

  });

  describe("Delete property not provinding id", function() {

    it("it should not delete property id is not provided", function() {

      expect(response.body.status).to.be.eql(false);
    });

    it("it should return required field message when id is not provided ", function() {
      expect(response.body.errors).to.have.property('id')
      expect(response.body.errors.id[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      propertyId = propertyIdRequest;
      expect(response.statusCode).to.be.eql(422);
    });

  });

});

describe("Testing delete property routes for acceptance flow", function() {

  describe("Delete property when correct Id is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return null", function() {
      
      expect(response.body.data).to.be.eql(null)
    });

  });

});
