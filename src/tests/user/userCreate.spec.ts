import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { fieldSizeMessage, invalidEmailMessage, requiredMessage, uniqueMessage } from '../../helpers/ErrorMessages';
import { ILogin } from '../../middleware/requests/AuthRequests';
import { IUser } from '../../models/User';
import server from '../../server'

chai.use(chaiHttp);

let response: any;
let requestData: IUser | {};

beforeEach(function (done) {
  chai.request(server)
    .post('/user')
    .send(requestData)
    .end((err, res) => {
      response = res;
      done();
    });
});

describe("Testing create user route for exception flows", function() {

  describe("Create user not provinding the required fields", function() {
    

    it("it should not login user when no email and password are provided", function() {
      requestData = {}
      expect(response.body.data).to.be.eql(null);
      
    });

    it("it should return required field message when no email and password provided ", function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors).to.have.property('password')
      expect(response.body.errors.email[0]).to.eql(requiredMessage);
      expect(response.body.errors.password[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

  describe("Email provided is not valid", function() {
    
    it("it should not create user when invalid email is provided", function() {
      requestData = { 'email':  'mail', 'password':  '12345' }
      expect(response.body.data).to.be.eql(null);
    });

    
    it(`it should return '${invalidEmailMessage}' when email provided is not valid`, function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors.email[0]).to.eql(invalidEmailMessage);
    });


    
    it("it should not create user when email provided is already in use", function() {
      requestData = { 'email':  'user@gmail.com', 'password':  '12345' }
      expect(response.body.data).to.be.eql(null);
    });
      
    it(`it should return '${uniqueMessage}' when email provided is is already in use`, function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors.email[0]).to.eql(uniqueMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });
    
  });

  describe("Password provided is not valid", function() {

    
    it("it should not not create user when password provided is too short", function() {
      requestData = { 'email':  'newuser@gmail.com', 'password':  '123' }
      expect(response.body.data).to.be.eql(null);
    });
 
    it(`it should return message '${fieldSizeMessage(5)}' when password provided is too short`, function() {
      expect(response.body.errors).to.have.property('password')
      expect(response.body.errors.password[0]).to.eql(fieldSizeMessage(5));
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });
});

describe("Testing create user routes for acceptance flow", function() {

  describe("Create user when correct email and password provided", function() {
 
    let error: Error, response: any;
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
          done();
        });
      });
      
    it("it should return token when correct email and password are provided", function() {
      expect(response.body.data).to.have.property('token')
    });

    it("it should return user info when correct email and password are provided", function() {
      expect(response.body.data.user).to.have.property('id')
      expect(response.body.data.user).to.have.property('email')
    });

  });

});

describe("Testing user info route for exception flows", function() {
  beforeEach(function (done) {
    chai.request(server)
        .get('/user/me')
        .end((err, res) => {
          response = res;
          done();
        });
  });

  describe("Accessing the route not logged in", function() {

    it("it should return statusCode unauthorized (401)", function() {
      expect(response.statusCode).to.be.eql(401);
    });

    it("it should not return user info", function() {
      expect(response.body.data).to.be.eql(null);
    });

  });
});