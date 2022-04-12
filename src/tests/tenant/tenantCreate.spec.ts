import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { invalidEmailMessage, invalidPhoneMessage, requiredMessage, unauthorizedError } from '../../helpers/ErrorMessages';
import { IUser } from '../../models/User';
import server from '../../server'

chai.use(chaiHttp);

let error: any, response: any;
let requestData: IUser | {};

let token: string;
let requestToken: string;

let login = {
  'email':  'user@gmail.com',
  'password':  '12345'
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


beforeEach(function (done) {
  let setAuth = token !== '' ? { "Authorization": `Bearer ${token}` } : {};

  chai.request(server)
    .post('/tenant')
    .set(setAuth)
    .send(requestData)
    .end((err, res) => {
      response = res;
      done();
    });
});


describe("Testing create tenant route for exception flows", function() {

  describe("Create tenant not provinding the required fields", function() {
    
    it("it should not create tenant when no name is provided", function() {
      requestData = {
        "email": "tenantmail@gmail.com",
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
    
    it("it should not create tenant when invalid email is provided", function() {
      requestData = {
        "name": "tenantTest",
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

    it("it should not create tenant when phone provided is not valid", function() {
      requestData = {
        "name": "tenantTest",
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

  describe("Create tenant when user not logged in", function() {
    
    it("it should not create tenant when user is not logged in", function() {
      token = '';
      requestData = {
        "name": "tenantTest",
        "email": "tenantmail@gmail.com",
        "phone":"5562912341234"
      }

      expect(response.body.status).to.be.eql(false);
    });

    it(`it should return message '${unauthorizedError}' user not logged in`, function() {
      expect(response.body.message).to.eql(unauthorizedError);
    });

    it('it should return statusCode Unauthorized (401)', function() {
      token = requestToken;
      expect(response.statusCode).to.be.eql(401);
    });

  });
});

describe("Testing create tenant routes for acceptance flow", function() {

  describe("Create tenant when required data only is provided", function() {

    it("it should return the created tenant info", function() {
      token = requestToken;
      requestData = {
        'name':  'My tenant',
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

  describe("Create tenant when all fields are provided", function() {

    it("it should return the created tenant info", function() {
      requestData = {
        'name':  'My tenant',
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