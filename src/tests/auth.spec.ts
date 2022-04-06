import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { errorLogin, requiredMessage, resourceNotFoundError } from '../helpers/ErrorMessages';
import server from '../server'

chai.use(chaiHttp);

describe("Testing auth routes for exception flows", function() {

  describe("No email and password provided", function() {
 
    let error: Error, response: any;
    let loginWithNoData = {}

    before(function(done) {
      chai.request(server)
        .post('/login')
        .send(loginWithNoData)
        .end((err, res) => {
          error = err, response = res;
          done();
        });
    });

    it("it should not login user when no email and password are provided", function() {
      expect(response.body.data).to.be.eql(null);
    });

    it("it should return required field message when no email and password provided ", function() {
      expect(response.body.errors).to.have.property('email')
      expect(response.body.errors).to.have.property('password')
      expect(response.body.errors.email[0]).to.eql(requiredMessage);
      expect(response.body.errors.password[0]).to.eql(requiredMessage);
    });

  });

  describe("Email provided not registered", function() {

    let error: Error, response: any;
    let loginWrongEmail = {
      'email':  'notuser@gmail.com',
      'password':  '12345'
    }

    before(function(done) {
      chai.request(server)
        .post('/login')
        .send(loginWrongEmail)
        .end((err, res) => {
          error = err, response = res;
          done();
        });
    });

    it("it should not login user when no email and password are provided", function() {
      expect(response.body.data).to.be.eql(null);
    });
      
    it("it should return 'Email not found message' when email not registered", function() {
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.eql(resourceNotFoundError('Email'));
    });
  });

  describe("Email registered but wrong password", function() {
    let error: Error, response: any;
 
    let loginWrongPassword = {
      'email':  'user@gmail.com',
      'password':  '123456'
    }

    before(function(done) {
      chai.request(server)
        .post('/login')
        .send(loginWrongPassword)
        .end((err, res) => {
          error = err, response = res;
          done();
        });
    });

    it("it should not login user when no email and password are provided", function() {
      expect(response.body.data).to.be.eql(null);
    });
 
    it("it should return message 'Password dit not match' when wrong message provided", function() {
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.eql(errorLogin);
    });

  });

});

describe("Testing auth routes for acceptance flow", function() {

  describe("Login user when correct email and password provided", function() {
 
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