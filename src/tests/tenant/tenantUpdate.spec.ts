import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { invalidEmailMessage, invalidPhoneMessage, requiredMessage, resourceNotFoundError, unauthorizedError } from '../../helpers/ErrorMessages';
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
      done();
  });
});

beforeEach(function (done) {
  let setAuth = checkToken();
  chai.request(server)
    .put(`/tenant/${tenantId}`)
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

describe("Testing update tenant route for exception flows", function() {

  describe("Update tenant not provinding the required fields", function() {
    
    it("it should not update tenant when no name is provided", function() {
      requestData = {
        "email": "tenant@email.com",
        "phone":"5562912341234"
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

  describe("Email provided is not valid", function() {
    
    it("it should not update tenant when invalid email is provided", function() {
      requestData = {
        "name": "Tenant to Update",
        "email": "tenantmailgmail.com",
        "phone":"5562912341234"
      }

      expect(response.body.status).to.be.eql(false);
    });

    
    it(`it should return '${invalidEmailMessage}' when email provided is not valid`, function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors.email[0]).to.eql(invalidEmailMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });
    
  });

  describe("Phone provided is not valid", function() {

    it("it should not update tenant when phone provided is not valid", function() {
      requestData = {
        "name": "Tenant to Update",
        "email": "tenantmail@gmail.com",
        "phone":"12341234"
      }

      expect(response.body.status).to.be.eql(false);
    });
 
    it(`it should return message '${invalidPhoneMessage}' when phone provided is not valid`, function() {
      expect(response.body.errors).to.have.property('phone')
      expect(response.body.errors.phone[0]).to.eql(invalidPhoneMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

  describe("Update tenant when user not logged in", function() {
    
    it("it should not update tenant when user is not logged in", function() {
      token = '';
      requestData = {
        "name": "Tenant to Update",
        "email": "tenantmail@gmail.com",
        "phone":"5562912341234"
      }

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

  describe("Update another user's tenant ", function() {
    
    it("it should not update another user's tenant", function() {
      
      requestData = {
        "name": "tenantTest",
        "email": "tenantmail@gmail.com",
        "phone":"5562912341234"
      }

      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${resourceNotFoundError('Resource')}' when tring to update another user's tenant`, function() {
      expect(response.body.message).to.eql(resourceNotFoundError('Resource'));
    });

    it('it should return statusCode Not Found (404)', function() {
      token = requestToken;
      tenantId = tenantIdRequest;
      expect(response.statusCode).to.be.eql(404);
    });

  });

});

describe("Testing update tenant routes for acceptance flow", function() {

  describe("Update tenant when required data only is provided", function() {

    it("it should return the updated info", function() {
     
      token = requestToken;
      requestData = {
        'name':  'Updated Tenant',
      }
      
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('email')
      expect(response.body.data).to.have.property('phone')
      expect(response.body.data).to.have.property('userId')
    });

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

  });

  describe("Update tenant when all fields are provided", function() {

    it("it should return the updated tenant info", function() {
      requestData = {
        'name':  'Updated Tenant',
        "email": "tenantmail@gmail.com",
        "phone":"5562912341234"
      }

      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('email')
      expect(response.body.data).to.have.property('phone')
      expect(response.body.data).to.have.property('userId')
    });

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

  });
});
