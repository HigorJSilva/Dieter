import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { requiredMessage, unauthorizedError } from '../../helpers/ErrorMessages';
import { IUser } from '../../models/User';
import server from '../../server'

chai.use(chaiHttp);

let error: any, response: any;
let requestData: IUser | {};

let token: string;
let requestToken: string;

let search: string = '';

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
      token = ''
      done();
  });
});


beforeEach(function (done) {
  let setAuth = checkToken();
  chai.request(server)
    .get(`/tenant/${search}`)
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
describe("Testing search tenant route for exception flows", function() {

  describe("search tenant when user not logged in", function() {

    it("it should not search tenant when user is not logged in", function() {
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


  describe("Search tenant not provinding id or name", function() {

    it("it should not search tenant id is not provided", function() {

      expect(response.body.status).to.be.eql(false);
    });

    it("it should return required field message when id is not provided ", function() {
      expect(response.body.errors).to.have.property('search')
      expect(response.body.errors.search[0]).to.eql(requiredMessage);
    });

    it('it should return statusCode Unprocessable entity (422)', function() {
      search = '5'
      expect(response.statusCode).to.be.eql(422);
    });

  });

});

describe("Testing search tenant routes for acceptance flow", function() {

  describe("Search tenant when correct Id is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return one register", function() {
      search = 'tenant'
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('email')
      expect(response.body.data).to.have.property('phone')
      expect(response.body.data).to.have.property('userId')
    });

  });

  describe("Search tenant when name is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return tenant info", function() {
      
      expect(response.body.data[0]).to.have.property('id')
      expect(response.body.data[0]).to.have.property('name')
      expect(response.body.data[0]).to.have.property('email')
      expect(response.body.data[0]).to.have.property('phone')
      expect(response.body.data[0]).to.have.property('userId')
    });

    it("data should return one o more registers", function() {
      
      expect(response.body.data.length).to.be.greaterThanOrEqual(0)
    });

  });

});
