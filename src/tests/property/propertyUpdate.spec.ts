import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { fieldSizeMessage, invalidEmailMessage, invalidPhoneMessage, requiredMessage, resourceNotFoundError, unauthorizedError } from '../../helpers/ErrorMessages';
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
      done();
  });
});

beforeEach(function (done) {
  let setAuth = checkToken();
  chai.request(server)
    .put(`/property/${propertyId}`)
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

describe("Testing update property route for exception flows", function() {

  describe("Update property not provinding the required fields", function() {
    
    it("it should not update property when no name is provided", function() {
      requestData = {
        "address": "5th Avenue, 412", 
        "waterCompanyId": "3432-1",
        "electricityCompanyId": null
      }

      expect(response.body.status).to.be.eql(false);
    });

    it("it should return required field message when no name is provided ", function() {
      expect(response.body.errors).to.have.property('name')
      expect(response.body.errors.name[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

  describe("Name provided is not valid", function() {
    
    it("it should not update property whenwhen name provided is too short", function() {
      requestData = {
        "name": "ok",
        "address": "5th Avenue, 412", 
        "waterCompanyId": "3432-1",
        "electricityCompanyId": null
      }

      expect(response.body.status).to.be.eql(false);
    });

    
    it(`it should return '${fieldSizeMessage(3)}' when name provided is too short`, function() {
      expect(response.body.errors).to.have.property('name')
      expect(response.body.errors.name[0]).to.eql(fieldSizeMessage(3));
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });
    
  });

  describe("Address provided is not valid", function() {

    it("it should not update property when address provided is not valid", function() {
      requestData = {
        "name": "Property to update",
        "address": "5th", 
        "waterCompanyId": "3432-1",
        "electricityCompanyId": null
      }

      expect(response.body.status).to.be.eql(false);
    });
 
    it(`it should return message '${fieldSizeMessage(6)}' when address provided is too short`, function() {
      expect(response.body.errors).to.have.property('address')
      expect(response.body.errors.address[0]).to.eql(fieldSizeMessage(6));
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

  describe("Update property when user not logged in", function() {
    
    it("it should not update property when user is not logged in", function() {
      token = '';
      requestData = {
        "name": "Property to update",
        "address": "5th Avenue, 412", 
        "waterCompanyId": "3432-1",
        "electricityCompanyId": null
      }

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

  describe("Update another user's property ", function() {
    
    it("it should not update another user's property", function() {
      
      requestData = {
        "name": "Property to update",
        "address": "5th Avenue, 412", 
        "waterCompanyId": "3432-1",
        "electricityCompanyId": null
      }

      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${resourceNotFoundError('Resource')}' when tring to update another user's property`, function() {
      expect(response.body.message).to.eql(resourceNotFoundError('Resource'));
    });

    it('it should return statusCode Not Found (404)', function() {
      token = requestToken;
      propertyId = propertyIdRequest;
      expect(response.statusCode).to.be.eql(404);
    });

  });

});

describe("Testing update property routes for acceptance flow", function() {

  describe("Update property when required data only is provided", function() {

    it("it should return the updated info", function() {
     
      token = requestToken;
      requestData = {
        "name": "Property to update",
      }
      
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('address')
      expect(response.body.data).to.have.property('waterCompanyId')
      expect(response.body.data).to.have.property('electricityCompanyId')
    });

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

  });

  describe("Update property when all fields are provided", function() {

    it("it should return the updated property info", function() {
      requestData = {
        "name": "Apartment 413, Wazowski Tower",
        "address": "5th Avenue, 412", 
        "waterCompanyId": "1784-4",
        "electricityCompanyId": "2342-7",
      }

      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('address')
      expect(response.body.data).to.have.property('waterCompanyId')
      expect(response.body.data).to.have.property('electricityCompanyId')
    });

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

  });
});
