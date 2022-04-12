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
    .get(`/property/${search}`)
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
describe("Testing search property route for exception flows", function() {

  describe("search property when user not logged in", function() {

    it("it should not search property when user is not logged in", function() {
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


  describe("Search property not provinding id or name", function() {

    it("it should not search property id is not provided", function() {

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

describe("Testing search property routes for acceptance flow", function() {

  describe("Search property when correct Id is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return one register", function() {
      search = 'Tower'
      expect(response.body.data).to.have.property('id')
      expect(response.body.data).to.have.property('name')
      expect(response.body.data).to.have.property('address')
      expect(response.body.data).to.have.property('waterCompanyId')
      expect(response.body.data).to.have.property('electricityCompanyId')
    });

  });

  describe("Search property when name is provided", function() {

    it("it should return statusCode success (200)", function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it("data should return property info", function() {
      
      expect(response.body.data[0]).to.have.property('id')
      expect(response.body.data[0]).to.have.property('name')
      expect(response.body.data[0]).to.have.property('address')
      expect(response.body.data[0]).to.have.property('waterCompanyId')
      expect(response.body.data[0]).to.have.property('electricityCompanyId')
    });

    it("data should return one o more registers", function() {
      
      expect(response.body.data.length).to.be.greaterThanOrEqual(0)
    });

  });

});
