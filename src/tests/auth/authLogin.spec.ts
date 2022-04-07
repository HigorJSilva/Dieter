import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { errorLogin, requiredMessage, resourceNotFoundError } from '../../helpers/ErrorMessages';
import { ILogin } from '../../middleware/requests/AuthRequests';
import server from '../../server'

chai.use(chaiHttp);

let response: any;
let requestData: ILogin | {};

describe('Testing auth routes for exception flows', function() {

  beforeEach(function (done) {
    chai.request(server)
        .post('/login')
        .send(requestData)
        .end((err, res) => {
          response = res;
          done();
        });
  });

  describe('No email and password provided', function() {

    it('it should not login user when no email and password are provided', function() {
      requestData = {}
      expect(response.body.data).to.be.eql(null);
    });

    it('it should return required field message when no email and password provided ', function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors).to.have.property('password')
      expect(response.body.errors.email[0]).to.eql(requiredMessage);
      expect(response.body.errors.password[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

  describe('Email provided not registered', function() {

    it('it should not login user when no email and password are provided', function() {
      requestData = { 'email':  'notuser@gmail.com', 'password':  '12345' }
      
      expect(response.body.data).to.be.eql(null);
    });
      
    it(`it should return '${resourceNotFoundError('Email')}' when email not registered`, function() {
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.eql(resourceNotFoundError('Email'));
    });

    it('it should return statusCode Not found (404)', function() {
      expect(response.statusCode).to.be.eql(404);
    });
    
  });

  describe('Email registered with wrong password provided', function() {

    it('it should not login user when no email and password are provided', function() {
      requestData = { 'email':  'user@gmail.com', 'password':  '123456' }
      
      expect(response.body.data).to.be.eql(null);
    });

 
    it(`it should return message '${errorLogin}' when wrong message provided`, function() {
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.eql(errorLogin);
    });

    it('it should not login user when no email and password are provided', function() {
      expect(response.body.data).to.be.eql(null);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      expect(response.statusCode).to.be.eql(422);
    });

  });

});

describe('Testing auth routes for acceptance flow', function() {

  describe('Login user when correct email and password provided', function() {
 
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

    it('it should return statusCode success (200)', function() {
      expect(response.statusCode).to.be.eql(200);
    });
      
    it('it should return token when correct email and password are provided', function() {
      expect(response.body.data).to.have.property('token')
    });

    it('it should return user info when correct email and password are provided', function() {
      expect(response.body.data.user).to.have.property('id')
      expect(response.body.data.user).to.have.property('email')
    });

  });

});